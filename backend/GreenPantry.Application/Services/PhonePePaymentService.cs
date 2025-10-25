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

public class PhonePePaymentService : IPhonePePaymentService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PhonePePaymentService> _logger;
    private readonly string _merchantId;
    private readonly string _merchantKey;
    private readonly string _webhookSecret;
    private readonly string _baseUrl;
    private readonly bool _isTestMode;

    public PhonePePaymentService(IConfiguration configuration, ILogger<PhonePePaymentService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _merchantId = _configuration["PaymentProviders:PhonePe:MerchantId"] ?? string.Empty;
        _merchantKey = _configuration["PaymentProviders:PhonePe:MerchantKey"] ?? string.Empty;
        _webhookSecret = _configuration["PaymentProviders:PhonePe:WebhookSecret"] ?? string.Empty;
        _isTestMode = _configuration.GetValue<bool>("PaymentProviders:PhonePe:IsTestMode", true);
        _baseUrl = _isTestMode 
            ? _configuration["PaymentProviders:PhonePe:TestBaseUrl"] ?? "https://api-preprod.phonepe.com/apis/pg-sandbox"
            : _configuration["PaymentProviders:PhonePe:BaseUrl"] ?? "https://api.phonepe.com/apis/pg/v1";
    }

    public async Task<PaymentResponseDto> CreatePaymentAsync(PaymentRequestDto request)
    {
        try
        {
            var orderId = $"ORDER_{request.OrderId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
            var amount = (int)(request.Amount * 100); // Convert to paise
            
            var requestData = new
            {
                merchantId = _merchantId,
                merchantTransactionId = orderId,
                amount = amount,
                merchantUserId = request.CustomerEmail,
                redirectUrl = _configuration["PaymentProviders:PhonePe:RedirectUrl"] ?? "",
                redirectMode = "POST",
                callbackUrl = _configuration["PaymentProviders:PhonePe:CallbackUrl"] ?? "",
                mobileNumber = request.CustomerPhone,
                paymentInstrument = new
                {
                    type = "PAY_PAGE"
                }
            };

            var jsonString = JsonSerializer.Serialize(requestData);
            var encodedPayload = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonString));
            var checksum = ComputeSha256(encodedPayload + "/pg/v1/pay" + _merchantKey);
            var xVerify = checksum + "###" + "1";

            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/pg/v1/pay", Method.Post);
            
            restRequest.AddHeader("Content-Type", "application/json");
            restRequest.AddHeader("X-VERIFY", xVerify);
            restRequest.AddHeader("accept", "application/json");

            var payload = new
            {
                request = encodedPayload
            };

            restRequest.AddJsonBody(payload);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("PhonePe payment creation failed: {Response}", response.Content);
                throw new Exception($"Failed to create PhonePe payment: {response.ErrorMessage}");
            }

            var responseData = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var data = responseData.GetProperty("data");
            var paymentUrl = data.GetProperty("instrumentResponse").GetProperty("redirectInfo").GetProperty("url").GetString()!;

            return new PaymentResponseDto
            {
                PaymentId = orderId,
                OrderId = request.OrderId,
                Provider = PaymentProvider.PhonePe,
                Status = PaymentStatus.Pending,
                Amount = request.Amount,
                Currency = request.Currency,
                ProviderTransactionId = orderId,
                PaymentUrl = paymentUrl,
                ProviderMetadata = new Dictionary<string, object>
                {
                    ["merchant_transaction_id"] = orderId,
                    ["amount"] = amount,
                    ["merchant_id"] = _merchantId
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating PhonePe payment for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<PaymentResponseDto> GenerateUPIQRAsync(UPIQRRequestDto request)
    {
        try
        {
            // First create a payment
            var paymentRequest = new PaymentRequestDto
            {
                OrderId = request.OrderId,
                OrderNumber = request.OrderId,
                Amount = request.Amount,
                Currency = request.Currency,
                Provider = PaymentProvider.PhonePe,
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
            _logger.LogError(ex, "Error generating PhonePe UPI QR for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<string> GeneratePhonePeUPIQRAsync(UPIQRRequestDto request)
    {
        var response = await GenerateUPIQRAsync(request);
        return response.UPIQRCode;
    }

    public async Task<PaymentResponseDto> GetPaymentStatusAsync(string paymentId)
    {
        try
        {
            var merchantTransactionId = paymentId;
            var checksum = ComputeSha256($"GET/pg/v1/status/{_merchantId}/{merchantTransactionId}" + _merchantKey);
            var xVerify = checksum + "###" + "1";

            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest($"/pg/v1/status/{_merchantId}/{merchantTransactionId}", Method.Get);
            
            restRequest.AddHeader("Content-Type", "application/json");
            restRequest.AddHeader("X-VERIFY", xVerify);
            restRequest.AddHeader("accept", "application/json");

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Failed to get PhonePe payment status: {Response}", response.Content);
                throw new Exception($"Failed to get payment status: {response.ErrorMessage}");
            }

            var statusData = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var data = statusData.GetProperty("data");
            var state = data.GetProperty("state").GetString()!;
            var amount = data.GetProperty("amount").GetInt32() / 100.0m;
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.PhonePe,
                Status = MapPhonePeStatus(state),
                Amount = amount,
                Currency = "INR",
                ProviderTransactionId = paymentId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting PhonePe payment status for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<bool> VerifyWebhookAsync(WebhookVerificationDto verification)
    {
        return await Task.FromResult(VerifyPhonePeWebhookAsync(verification.Signature, verification.Payload));
    }

    public bool VerifyPhonePeWebhookAsync(string signature, string payload)
    {
        try
        {
            var expectedSignature = ComputeSha256(payload + _webhookSecret);
            return signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying PhonePe webhook signature");
            return false;
        }
    }

    public async Task<PaymentResponseDto> ProcessWebhookAsync(string payload, PaymentProvider provider)
    {
        try
        {
            var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
            
            _logger.LogInformation("Processing PhonePe webhook event");

            var response = webhookData.GetProperty("response");
            var merchantTransactionId = response.GetProperty("merchantTransactionId").GetString()!;
            var state = response.GetProperty("state").GetString()!;
            var amount = response.GetProperty("amount").GetInt32() / 100.0m;
            var transactionId = response.GetProperty("transactionId").GetString()!;

            return new PaymentResponseDto
            {
                PaymentId = merchantTransactionId,
                Provider = PaymentProvider.PhonePe,
                Status = MapPhonePeStatus(state),
                Amount = amount,
                Currency = "INR",
                ProviderTransactionId = transactionId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PhonePe webhook");
            throw;
        }
    }

    public async Task<PaymentResponseDto> RefundPaymentAsync(string paymentId, decimal amount, string reason)
    {
        try
        {
            var refundId = $"REFUND_{paymentId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
            var refundAmount = (int)(amount * 100);
            
            var requestData = new
            {
                merchantId = _merchantId,
                merchantUserId = refundId,
                originalTransactionId = paymentId,
                merchantTransactionId = refundId,
                amount = refundAmount,
                callbackUrl = _configuration["PaymentProviders:PhonePe:RefundCallbackUrl"] ?? ""
            };

            var jsonString = JsonSerializer.Serialize(requestData);
            var encodedPayload = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonString));
            var checksum = ComputeSha256(encodedPayload + "/pg/v1/refund" + _merchantKey);
            var xVerify = checksum + "###" + "1";

            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/pg/v1/refund", Method.Post);
            
            restRequest.AddHeader("Content-Type", "application/json");
            restRequest.AddHeader("X-VERIFY", xVerify);
            restRequest.AddHeader("accept", "application/json");

            var payload = new
            {
                request = encodedPayload
            };

            restRequest.AddJsonBody(payload);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("PhonePe refund failed: {Response}", response.Content);
                throw new Exception($"Failed to process refund: {response.ErrorMessage}");
            }

            var refundResponse = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var data = refundResponse.GetProperty("data");
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.PhonePe,
                Status = PaymentStatus.Refunded,
                RefundId = refundId,
                RefundAmount = amount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PhonePe refund for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<PaymentConfiguration> GetPaymentConfigurationAsync(PaymentProvider provider)
    {
        return await Task.FromResult(new PaymentConfiguration
        {
            Provider = PaymentProvider.PhonePe,
            IsEnabled = _configuration.GetValue<bool>("PaymentProviders:PhonePe:IsEnabled", true),
            IsTestMode = _isTestMode,
            ApiKey = _merchantId,
            ApiSecret = _merchantKey,
            WebhookSecret = _webhookSecret,
            BaseUrl = _configuration["PaymentProviders:PhonePe:BaseUrl"] ?? "https://api.phonepe.com/apis/pg/v1",
            TestBaseUrl = _configuration["PaymentProviders:PhonePe:TestBaseUrl"] ?? "https://api-preprod.phonepe.com/apis/pg-sandbox",
            QRExpiryMinutes = _configuration.GetValue<int>("PaymentProviders:PhonePe:QRExpiryMinutes", 15),
            MinAmount = _configuration.GetValue<decimal>("PaymentProviders:PhonePe:MinAmount", 1.0m),
            MaxAmount = _configuration.GetValue<decimal>("PaymentProviders:PhonePe:MaxAmount", 100000.0m)
        });
    }

    public async Task<bool> UpdatePaymentConfigurationAsync(PaymentConfiguration configuration)
    {
        return await Task.FromResult(true);
    }

    private string GenerateUPIString(UPIQRRequestDto request)
    {
        var upiId = _configuration["PaymentProviders:PhonePe:UPIId"] ?? "greenpantry@phonepe";
        var merchantName = _configuration["PaymentProviders:PhonePe:MerchantName"] ?? "GreenPantry";
        
        return $"upi://pay?pa={upiId}&pn={merchantName}&am={request.Amount:F2}&cu={request.Currency}&tr={request.OrderId}&tn={request.Description}";
    }

    private string GenerateQRCode(string data)
    {
        // Simplified QR code generation - return placeholder for now
        // In production, this would generate actual QR codes
        return $"data:image/png;base64,QR_PLACEHOLDER_FOR_{data}";
    }

    private string ComputeSha256(string input)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(hash).ToLower();
    }

    private PaymentStatus MapPhonePeStatus(string phonePeStatus)
    {
        return phonePeStatus.ToUpper() switch
        {
            "COMPLETED" => PaymentStatus.Success,
            "FAILED" => PaymentStatus.Failed,
            "PENDING" => PaymentStatus.Pending,
            "CANCELLED" => PaymentStatus.Cancelled,
            _ => PaymentStatus.Pending
        };
    }
}

