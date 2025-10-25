using GreenPantry.Application.DTOs.Order;

namespace GreenPantry.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(CreateOrderRequest request, string userId);
    Task<OrderDto?> GetOrderByIdAsync(string id);
    Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId);
    Task<IEnumerable<OrderDto>> GetOrdersByRestaurantIdAsync(string restaurantId);
    Task<OrderDto> UpdateOrderStatusAsync(string id, UpdateOrderStatusRequest request);
    Task<bool> CancelOrderAsync(string id, string userId);
}
