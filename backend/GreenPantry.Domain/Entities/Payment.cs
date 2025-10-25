using GreenPantry.Domain.Enums;

namespace GreenPantry.Domain.Entities;

public class Payment : BaseEntity
{
    public string OrderId { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public PaymentProvider Provider { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string ProviderTransactionId { get; set; } = string.Empty;
    public string ProviderOrderId { get; set; } = string.Empty;
    public string UPIQRCode { get; set; } = string.Empty;
    public string UPIQRData { get; set; } = string.Empty;
    public UPIQRType QRType { get; set; } = UPIQRType.Dynamic;
    public DateTime? QRGeneratedAt { get; set; }
    public DateTime? QRExpiresAt { get; set; }
    public string WebhookId { get; set; } = string.Empty;
    public string FailureReason { get; set; } = string.Empty;
    public string RefundId { get; set; } = string.Empty;
    public decimal RefundAmount { get; set; }
    public DateTime? RefundedAt { get; set; }
    public string RefundReason { get; set; } = string.Empty;
    public Dictionary<string, object> ProviderMetadata { get; set; } = new();
    public List<PaymentWebhook> Webhooks { get; set; } = new();
}

public class PaymentWebhook
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string PaymentId { get; set; } = string.Empty;
    public PaymentProvider Provider { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string RawPayload { get; set; } = string.Empty;
    public Dictionary<string, object> ParsedPayload { get; set; } = new();
    public bool IsProcessed { get; set; } = false;
    public string ProcessingError { get; set; } = string.Empty;
    public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
}

