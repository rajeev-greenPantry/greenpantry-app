using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.DTOs.Payment;

public class PaymentRequestDto
{
    public string OrderId { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public PaymentProvider Provider { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class UPIQRRequestDto
{
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public PaymentProvider Provider { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; } = 15;
}

public class PaymentResponseDto
{
    public string PaymentId { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public PaymentProvider Provider { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string ProviderTransactionId { get; set; } = string.Empty;
    public string UPIQRCode { get; set; } = string.Empty;
    public string UPIQRData { get; set; } = string.Empty;
    public DateTime? QRExpiresAt { get; set; }
    public string PaymentUrl { get; set; } = string.Empty;
    public Dictionary<string, object> ProviderMetadata { get; set; } = new();
    public string RefundId { get; set; } = string.Empty;
    public decimal RefundAmount { get; set; }
    public string FailureReason { get; set; } = string.Empty;
}

public class WebhookVerificationDto
{
    public string Signature { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public PaymentProvider Provider { get; set; }
    public string EventType { get; set; } = string.Empty;
}

