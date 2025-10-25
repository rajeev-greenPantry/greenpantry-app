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

public class PaytmPaymentService : IPaytmPaymentService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaytmPaymentService> _logger;
    private readonly string _merchantId;
    private readonly string _merchantKey;
    private readonly string _webhookSecret;
    private readonly string _baseUrl;
    private readonly bool _isTestMode;

    public PaytmPaymentService(IConfiguration configuration, ILogger<PaytmPaymentService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _merchantId = _configuration["PaymentProviders:Paytm:MerchantId"] ?? string.Empty;
        _merchantKey = _configuration["PaymentProviders:Paytm:MerchantKey"] ?? string.Empty;
        _webhookSecret = _configuration["PaymentProviders:Paytm:WebhookSecret"] ?? string.Empty;
        _isTestMode = _configuration.GetValue<bool>("PaymentProviders:Paytm:IsTestMode", true);
        _baseUrl = _isTestMode 
            ? _configuration["PaymentProviders:Paytm:TestBaseUrl"] ?? "https://securegw-stage.paytm.in"
            : _configuration["PaymentProviders:Paytm:BaseUrl"] ?? "https://securegw.paytm.in";
    }

    public async Task<PaymentResponseDto> CreatePaymentAsync(PaymentRequestDto request)
    {
        try
        {
            var orderId = $"ORDER_{request.OrderId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
            var amount = request.Amount.ToString("F2");
            
            var paytmParams = new Dictionary<string, string>
            {
                ["MID"] = _merchantId,
                ["ORDER_ID"] = orderId,
                ["CUST_ID"] = request.CustomerEmail,
                ["TXN_AMOUNT"] = amount,
                ["CHANNEL_ID"] = "WAP",
                ["INDUSTRY_TYPE_ID"] = "Retail",
                ["WEBSITE"] = _isTestMode ? "WEBSTAGING" : "DEFAULT",
                ["CALLBACK_URL"] = _configuration["PaymentProviders:Paytm:CallbackUrl"] ?? "",
                ["MOBILE_NO"] = request.CustomerPhone,
                ["EMAIL"] = request.CustomerEmail
            };

            var checksum = GenerateChecksum(paytmParams);
            paytmParams["CHECKSUMHASH"] = checksum;

            // Convert Dictionary<string, string> to Dictionary<string, object>
            var metadata = new Dictionary<string, object>();
            foreach (var kvp in paytmParams)
            {
                metadata[kvp.Key] = kvp.Value;
            }

            return new PaymentResponseDto
            {
                PaymentId = orderId,
                OrderId = request.OrderId,
                Provider = PaymentProvider.Paytm,
                Status = PaymentStatus.Pending,
                Amount = request.Amount,
                Currency = request.Currency,
                ProviderTransactionId = orderId,
                PaymentUrl = $"{_baseUrl}/theia/processTransaction",
                ProviderMetadata = metadata
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Paytm payment for order {OrderId}", request.OrderId);
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
                Provider = PaymentProvider.Paytm,
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
            _logger.LogError(ex, "Error generating Paytm UPI QR for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<string> GeneratePaytmUPIQRAsync(UPIQRRequestDto request)
    {
        var response = await GenerateUPIQRAsync(request);
        return response.UPIQRCode;
    }

    public async Task<PaymentResponseDto> GetPaymentStatusAsync(string paymentId)
    {
        try
        {
            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/v3/order/status", Method.Post);
            
            restRequest.AddHeader("Content-Type", "application/json");

            var requestData = new
            {
                body = new
                {
                    mid = _merchantId,
                    orderId = paymentId
                }
            };

            var checksum = GenerateChecksumForStatusCheck(paymentId);
            restRequest.AddHeader("x-checksum", checksum);
            restRequest.AddJsonBody(requestData);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Failed to get Paytm order status: {Response}", response.Content);
                throw new Exception($"Failed to get order status: {response.ErrorMessage}");
            }

            var statusData = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var body = statusData.GetProperty("body");
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.Paytm,
                Status = MapPaytmStatus(body.GetProperty("resultInfo").GetProperty("resultStatus").GetString()!),
                Amount = decimal.Parse(body.GetProperty("txnAmount").GetString()!),
                Currency = "INR",
                ProviderTransactionId = paymentId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Paytm payment status for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<bool> VerifyWebhookAsync(WebhookVerificationDto verification)
    {
        return await Task.FromResult(VerifyPaytmWebhookAsync(verification.Signature, verification.Payload));
    }

    public bool VerifyPaytmWebhookAsync(string signature, string payload)
    {
        try
        {
            var expectedSignature = ComputeHmacSha256(payload, _webhookSecret);
            return signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Paytm webhook signature");
            return false;
        }
    }

    public async Task<PaymentResponseDto> ProcessWebhookAsync(string payload, PaymentProvider provider)
    {
        try
        {
            var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
            
            _logger.LogInformation("Processing Paytm webhook event");

            var orderId = webhookData.GetProperty("ORDERID").GetString()!;
            var status = webhookData.GetProperty("STATUS").GetString()!;
            var amount = decimal.Parse(webhookData.GetProperty("TXNAMOUNT").GetString()!);
            var txnId = webhookData.GetProperty("TXNID").GetString()!;

            return new PaymentResponseDto
            {
                PaymentId = orderId,
                Provider = PaymentProvider.Paytm,
                Status = MapPaytmStatus(status),
                Amount = amount,
                Currency = "INR",
                ProviderTransactionId = txnId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Paytm webhook");
            throw;
        }
    }

    public async Task<PaymentResponseDto> RefundPaymentAsync(string paymentId, decimal amount, string reason)
    {
        try
        {
            var client = new RestClient(_baseUrl);
            var restRequest = new RestRequest("/v2/refund/apply", Method.Post);
            
            restRequest.AddHeader("Content-Type", "application/json");

            var refundData = new
            {
                body = new
                {
                    mid = _merchantId,
                    orderId = paymentId,
                    refundAmount = amount.ToString("F2"),
                    txnId = paymentId
                }
            };

            var checksum = GenerateChecksumForRefund(paymentId, amount);
            restRequest.AddHeader("x-checksum", checksum);
            restRequest.AddJsonBody(refundData);

            var response = await client.ExecuteAsync(restRequest);
            
            if (!response.IsSuccessful)
            {
                _logger.LogError("Paytm refund failed: {Response}", response.Content);
                throw new Exception($"Failed to process refund: {response.ErrorMessage}");
            }

            var refundResponse = JsonSerializer.Deserialize<JsonElement>(response.Content!);
            var body = refundResponse.GetProperty("body");
            
            return new PaymentResponseDto
            {
                PaymentId = paymentId,
                Provider = PaymentProvider.Paytm,
                Status = PaymentStatus.Refunded,
                RefundId = body.GetProperty("refundId").GetString()!,
                RefundAmount = amount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Paytm refund for {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<PaymentConfiguration> GetPaymentConfigurationAsync(PaymentProvider provider)
    {
        return await Task.FromResult(new PaymentConfiguration
        {
            Provider = PaymentProvider.Paytm,
            IsEnabled = _configuration.GetValue<bool>("PaymentProviders:Paytm:IsEnabled", true),
            IsTestMode = _isTestMode,
            ApiKey = _merchantId,
            ApiSecret = _merchantKey,
            WebhookSecret = _webhookSecret,
            BaseUrl = _configuration["PaymentProviders:Paytm:BaseUrl"] ?? "https://securegw.paytm.in",
            TestBaseUrl = _configuration["PaymentProviders:Paytm:TestBaseUrl"] ?? "https://securegw-stage.paytm.in",
            QRExpiryMinutes = _configuration.GetValue<int>("PaymentProviders:Paytm:QRExpiryMinutes", 15),
            MinAmount = _configuration.GetValue<decimal>("PaymentProviders:Paytm:MinAmount", 1.0m),
            MaxAmount = _configuration.GetValue<decimal>("PaymentProviders:Paytm:MaxAmount", 100000.0m)
        });
    }

    public async Task<bool> UpdatePaymentConfigurationAsync(PaymentConfiguration configuration)
    {
        return await Task.FromResult(true);
    }

    private string GenerateUPIString(UPIQRRequestDto request)
    {
        var upiId = _configuration["PaymentProviders:Paytm:UPIId"] ?? "greenpantry@paytm";
        var merchantName = _configuration["PaymentProviders:Paytm:MerchantName"] ?? "GreenPantry";
        
        return $"upi://pay?pa={upiId}&pn={merchantName}&am={request.Amount:F2}&cu={request.Currency}&tr={request.OrderId}&tn={request.Description}";
    }

    private string GenerateQRCode(string data)
    {
        // Simplified QR code generation - return placeholder for now
        // In production, this would generate actual QR codes
        return $"data:image/png;base64,QR_PLACEHOLDER_FOR_{data}";
    }

    private string GenerateChecksum(Dictionary<string, string> parameters)
    {
        var sortedParams = parameters.OrderBy(x => x.Key).ToDictionary(x => x.Key, x => x.Value);
        var paramString = string.Join("&", sortedParams.Select(x => $"{x.Key}={x.Value}"));
        return ComputeHmacSha256(paramString, _merchantKey);
    }

    private string GenerateChecksumForStatusCheck(string orderId)
    {
        var paramString = $"MID={_merchantId}&ORDERID={orderId}";
        return ComputeHmacSha256(paramString, _merchantKey);
    }

    private string GenerateChecksumForRefund(string orderId, decimal amount)
    {
        var paramString = $"MID={_merchantId}&ORDERID={orderId}&REFUNDAMOUNT={amount:F2}";
        return ComputeHmacSha256(paramString, _merchantKey);
    }

    private string ComputeHmacSha256(string data, string key)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash);
    }

    private PaymentStatus MapPaytmStatus(string paytmStatus)
    {
        return paytmStatus.ToUpper() switch
        {
            "TXN_SUCCESS" => PaymentStatus.Success,
            "TXN_FAILURE" => PaymentStatus.Failed,
            "PENDING" => PaymentStatus.Pending,
            "TXN_CANCELLED" => PaymentStatus.Cancelled,
            _ => PaymentStatus.Pending
        };
    }
}

