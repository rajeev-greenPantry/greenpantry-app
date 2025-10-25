using GreenPantry.Domain.Enums;

namespace GreenPantry.Domain.Entities;

public class Order : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string RestaurantId { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public List<OrderItem> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public Address DeliveryAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    public PaymentProvider? PaymentProvider { get; set; }
    public string PaymentId { get; set; } = string.Empty;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string UPIQRCode { get; set; } = string.Empty;
    public DateTime? PaymentExpiresAt { get; set; }
    public DateTime? EstimatedDeliveryTime { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string DeliveryInstructions { get; set; } = string.Empty;
    public string DeliveryPersonId { get; set; } = string.Empty;
    public List<OrderStatusHistory> StatusHistory { get; set; } = new();
    public List<Payment> Payments { get; set; } = new();
}

public class OrderItem
{
    public string MenuItemId { get; set; } = string.Empty;
    public string MenuItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string Variant { get; set; } = string.Empty;
    public string SpecialInstructions { get; set; } = string.Empty;
}

public class OrderStatusHistory
{
    public OrderStatus Status { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Notes { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
}

