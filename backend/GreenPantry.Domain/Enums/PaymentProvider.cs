namespace GreenPantry.Domain.Enums;

public enum PaymentProvider
{
    Razorpay,
    Paytm,
    PhonePe
}

public enum PaymentStatus
{
    Pending,
    Processing,
    Success,
    Failed,
    Cancelled,
    Refunded,
    PartiallyRefunded
}

public enum UPIQRType
{
    Static,
    Dynamic
}

