using GreenPantry.Domain.Enums;

namespace GreenPantry.Domain.Entities;

public class PaymentConfiguration : BaseEntity
{
    public PaymentProvider Provider { get; set; }
    public bool IsEnabled { get; set; } = true;
    public bool IsTestMode { get; set; } = true;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string TestBaseUrl { get; set; } = string.Empty;
    public int QRExpiryMinutes { get; set; } = 15;
    public decimal MinAmount { get; set; } = 1.0m;
    public decimal MaxAmount { get; set; } = 100000.0m;
    public List<string> SupportedCurrencies { get; set; } = new() { "INR" };
    public Dictionary<string, object> AdditionalSettings { get; set; } = new();
}

