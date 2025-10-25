using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using GreenPantry.Application.DTOs.Payment;
using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using GreenPantry.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using QRCoder;
using RestSharp;

namespace GreenPantry.Application.Services;

public class RazorpayPaymentService : IRazorpayPaymentService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RazorpayPaymentService> _logger;
    private readonly string _apiKey;
    private readonly string _apiSecret;
    private readonly string _webhookSecret;
    private readonly string _baseUrl;
    private readonly bool _isTestMode;

    public RazorpayPaymentService(IConfiguration configuration, ILogger<RazorpayPaymentService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _apiKey = _configuration["PaymentProviders:Razorpay:ApiKey"] ?? string.Empty;
        _apiSecret = _configuration["PaymentProviders:Razorpay:ApiSecret"] ?? string.Empty;
        _webhookSecret = _configuration["PaymentProviders:Razorpay:WebhookSecret"] ?? string.Empty;
        _isTestMode = _configuration.GetValue<bool>("PaymentProviders:Razorpay:IsTestMode", true);
        _baseUrl = _isTestMode 
            ? _configuration["PaymentProviders:Razorpay:TestBaseUrl"] ?? "https://api.razorpay.com/v1"
            : _configuration["PaymentProviders:Razorpay:BaseUrl"] ?? "https://api.razorpay.com/v1";
    }

    public async Task<PaymentResponseDto> CreatePaymentAsync(PaymentRequestDto request)
    {
        try
        {
            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/orders", Method.Post);
            
            restRequest.AddHeader("Authorization", $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_apiKey}:{_apiSecret}"))}");
            restRequest.AddHeader("Content-Type", "application/json");

            var orderData = new
            {
                amount = (int)(request.Amount * 100), // Convert to paise
                currency = request.Currency,
                receipt = request.OrderNumber,
                notes = new Dictionary<string, object>
                {
                    ["order_id"] = request.OrderId,
                    ["customer_name"] = request.CustomerName,
                    ["customer_email"] = request.CustomerEmail,
                    ["customer_phone"] = request.CustomerPhone
                }
            };

            restRequest.AddJsonBody(orderData);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Razorpay order creation failed: {Response}", response.Content);
                throw new Exception($"Failed to create Razorpay order: {response.ErrorMessage}");
            }

            var orderResponse = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var orderId = orderResponse.GetProperty("id").GetString()!;

            return new PaymentResponseDto
            {
                PaymentId = orderId,
                OrderId = request.OrderId,
                Provider = PaymentProvider.Razorpay,
                Status = PaymentStatus.Pending,
                Amount = request.Amount,
                Currency = request.Currency,
                ProviderTransactionId = orderId,
                ProviderMetadata = new Dictionary<string, object>
                {
                    ["razorpay_order_id"] = orderId,
                    ["amount"] = orderResponse.GetProperty("amount").GetInt32(),
                    ["currency"] = orderResponse.GetProperty("currency").GetString()!,
                    ["status"] = orderResponse.GetProperty("status").GetString()!
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Razorpay payment for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<PaymentResponseDto> GenerateUPIQRAsync(UPIQRRequestDto request)
    {
        try
        {
            // First create an order
            var paymentRequest = new PaymentRequestDto
            {
                OrderId = request.OrderId,
                OrderNumber = request.OrderId,
                Amount = request.Amount,
                Currency = request.Currency,
                Provider = PaymentProvider.Razorpay,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                Description = request.Description
            };

            var paymentResponse = await CreatePaymentAsync(paymentRequest);

            // Generate UPI QR code
            var upiString = GenerateUPIString(request);
            var qrCode = GenerateQRCode(upiString);

            paymentResponse.UPIQRCode = qrCode;
            paymentResponse.UPIQRData = upiString;
            paymentResponse.QRExpiresAt = DateTime.UtcNow.AddMinutes(request.ExpiryMinutes);

            return paymentResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Razorpay UPI QR for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<string> GenerateRazorpayUPIQRAsync(UPIQRRequestDto request)
    {
        var response = await GenerateUPIQRAsync(request);
        return response.UPIQRCode;
    }

    public async Task<PaymentResponseDto> GetPaymentStatusAsync(string paymentId)
    {
        try
        {
            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest($"/orders/{paymentId}", Method.Get);
            
            restRequest.AddHeader("Authorization", $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_apiKey}:{_apiSecret}"))}");

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Failed to get Razorpay order status: {Response}", response.Content);
                throw new Exception($"Failed to get order status: {response.ErrorMessage}");
            }

            var orderData = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.Razorpay,
                Status = MapRazorpayStatus(orderData.GetProperty("status").GetString()!),
                Amount = orderData.GetProperty("amount").GetInt32() / 100.0m,
                Currency = orderData.GetProperty("currency").GetString()!,
                ProviderTransactionId = paymentId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Razorpay payment status for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<bool> VerifyWebhookAsync(WebhookVerificationDto verification)
    {
        return await Task.FromResult(VerifyRazorpayWebhookAsync(verification.Signature, verification.Payload));
    }

    public bool VerifyRazorpayWebhookAsync(string signature, string payload)
    {
        try
        {
            var expectedSignature = ComputeHmacSha256(payload, _webhookSecret);
            return signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Razorpay webhook signature");
            return false;
        }
    }

    public async Task<PaymentResponseDto> ProcessWebhookAsync(string payload, PaymentProvider provider)
    {
        try
        {
            var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
            var eventType = webhookData.GetProperty("event").GetString()!;
            
            _logger.LogInformation("Processing Razorpay webhook event: {EventType}", eventType);

            switch (eventType)
            {
                case "payment.captured":
                    return await ProcessPaymentCaptured(webhookData);
                case "payment.failed":
                    return await ProcessPaymentFailed(webhookData);
                default:
                    _logger.LogWarning("Unhandled Razorpay webhook event: {EventType}", eventType);
                    break;
            }

            return new PaymentResponseDto();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Razorpay webhook");
            throw;
        }
    }

    public async Task<PaymentResponseDto> RefundPaymentAsync(string paymentId, decimal amount, string reason)
    {
        try
        {
            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/refunds", Method.Post);
            
            restRequest.AddHeader("Authorization", $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_apiKey}:{_apiSecret}"))}");
            restRequest.AddHeader("Content-Type", "application/json");

            var refundData = new
            {
                payment_id = paymentId,
                amount = (int)(amount * 100),
                notes = new Dictionary<string, object>
                {
                    ["reason"] = reason
                }
            };

            restRequest.AddJsonBody(refundData);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Razorpay refund failed: {Response}", response.Content);
                throw new Exception($"Failed to process refund: {response.ErrorMessage}");
            }

            var refundResponse = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.Razorpay,
                Status = PaymentStatus.Refunded,
                RefundId = refundResponse.GetProperty("id").GetString()!,
                RefundAmount = amount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Razorpay refund for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<PaymentConfiguration> GetPaymentConfigurationAsync(PaymentProvider provider)
    {
        return await Task.FromResult(new PaymentConfiguration
        {
            Provider = PaymentProvider.Razorpay,
            IsEnabled = _configuration.GetValue<bool>("PaymentProviders:Razorpay:IsEnabled", true),
            IsTestMode = _isTestMode,
            ApiKey = _apiKey,
            ApiSecret = _apiSecret,
            WebhookSecret = _webhookSecret,
            BaseUrl = _configuration["PaymentProviders:Razorpay:BaseUrl"] ?? "https://api.razorpay.com/v1",
            TestBaseUrl = _configuration["PaymentProviders:Razorpay:TestBaseUrl"] ?? "https://api.razorpay.com/v1",
            QRExpiryMinutes = _configuration.GetValue<int>("PaymentProviders:Razorpay:QRExpiryMinutes", 15),
            MinAmount = _configuration.GetValue<decimal>("PaymentProviders:Razorpay:MinAmount", 1.0m),
            MaxAmount = _configuration.GetValue<decimal>("PaymentProviders:Razorpay:MaxAmount", 100000.0m)
        });
    }

    public async Task<bool> UpdatePaymentConfigurationAsync(PaymentConfiguration configuration)
    {
        // In a real implementation, this would update the configuration in the database
        return await Task.FromResult(true);
    }

    private string GenerateUPIString(UPIQRRequestDto request)
    {
        var upiId = _configuration["PaymentProviders:Razorpay:UPIId"] ?? "greenpantry@razorpay";
        var merchantName = _configuration["PaymentProviders:Razorpay:MerchantName"] ?? "GreenPantry";
        
        return $"upi://pay?pa={upiId}&pn={merchantName}&am={request.Amount:F2}&cu={request.Currency}&tr={request.OrderId}&tn={request.Description}";
    }

    private string GenerateQRCode(string data)
    {
        // Simplified QR code generation - return placeholder for now
        // In production, this would generate actual QR codes
        return $"data:image/png;base64,QR_PLACEHOLDER_FOR_{data}";
    }

    private string ComputeHmacSha256(string payload, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(hash).ToLower();
    }

    private PaymentStatus MapRazorpayStatus(string razorpayStatus)
    {
        return razorpayStatus.ToLower() switch
        {
            "created" => PaymentStatus.Pending,
            "attempted" => PaymentStatus.Processing,
            "paid" => PaymentStatus.Success,
            "failed" => PaymentStatus.Failed,
            _ => PaymentStatus.Pending
        };
    }

    private async Task<PaymentResponseDto> ProcessPaymentCaptured(JsonElement webhookData)
    {
        var paymentData = webhookData.GetProperty("contains")[0];
        var orderId = paymentData.GetProperty("order_id").GetString()!;
        
        return new PaymentResponseDto
        {
            PaymentId = orderId,
            Provider = PaymentProvider.Razorpay,
            Status = PaymentStatus.Success,
            ProviderTransactionId = paymentData.GetProperty("id").GetString()!,
            Amount = paymentData.GetProperty("amount").GetInt32() / 100.0m,
            Currency = paymentData.GetProperty("currency").GetString()!
        };
    }

    private async Task<PaymentResponseDto> ProcessPaymentFailed(JsonElement webhookData)
    {
        var paymentData = webhookData.GetProperty("contains")[0];
        var orderId = paymentData.GetProperty("order_id").GetString()!;
        
        return new PaymentResponseDto
        {
            PaymentId = orderId,
            Provider = PaymentProvider.Razorpay,
            Status = PaymentStatus.Failed,
            ProviderTransactionId = paymentData.GetProperty("id").GetString()!,
            FailureReason = paymentData.GetProperty("error_description").GetString() ?? "Payment failed"
        };
    }
}

