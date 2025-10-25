using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.DTOs.Order;

public class OrderDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string RestaurantId { get; set; } = string.Empty;
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
    public decimal SubTotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public AddressDto DeliveryAddress { get; set; } = new();
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public DateTime? EstimatedDeliveryTime { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string DeliveryInstructions { get; set; } = string.Empty;
    public string DeliveryPersonId { get; set; } = string.Empty;
    public List<OrderStatusHistoryDto> StatusHistory { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class OrderItemDto
{
    public string MenuItemId { get; set; } = string.Empty;
    public string MenuItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string Variant { get; set; } = string.Empty;
    public string SpecialInstructions { get; set; } = string.Empty;
}

public class OrderStatusHistoryDto
{
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
}

public class CreateOrderRequest
{
    public string RestaurantId { get; set; } = string.Empty;
    public List<CreateOrderItemRequest> Items { get; set; } = new();
    public AddressDto DeliveryAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    public string DeliveryInstructions { get; set; } = string.Empty;
}

public class CreateOrderItemRequest
{
    public string MenuItemId { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Variant { get; set; } = string.Empty;
    public string SpecialInstructions { get; set; } = string.Empty;
}

public class UpdateOrderStatusRequest
{
    public OrderStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
}
