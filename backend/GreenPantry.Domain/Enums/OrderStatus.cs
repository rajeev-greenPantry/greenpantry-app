namespace GreenPantry.Domain.Enums;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    ReadyForPickup,
    ReadyForDelivery,
    OutForDelivery,
    Delivered,
    Cancelled,
    Refunded
}
