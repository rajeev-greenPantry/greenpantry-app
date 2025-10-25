using AutoMapper;
using GreenPantry.Application.DTOs.Order;
using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using GreenPantry.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IMenuItemRepository menuItemRepository,
        IMapper mapper,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _menuItemRepository = menuItemRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request, string userId)
    {
        _logger.LogInformation("Creating order for user: {UserId}", userId);

        var order = new Order
        {
            UserId = userId,
            RestaurantId = request.RestaurantId,
            OrderNumber = GenerateOrderNumber(),
            Status = OrderStatus.Pending,
            DeliveryAddress = _mapper.Map<Address>(request.DeliveryAddress),
            PaymentMethod = request.PaymentMethod,
            DeliveryInstructions = request.DeliveryInstructions,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Process order items
        decimal subTotal = 0;
        foreach (var itemRequest in request.Items)
        {
            var menuItem = await _menuItemRepository.GetByIdAsync(itemRequest.MenuItemId);
            if (menuItem == null || !menuItem.IsAvailable)
            {
                throw new InvalidOperationException($"Menu item {itemRequest.MenuItemId} is not available");
            }

            var orderItem = new OrderItem
            {
                MenuItemId = itemRequest.MenuItemId,
                MenuItemName = menuItem.Name,
                Quantity = itemRequest.Quantity,
                UnitPrice = menuItem.Price,
                TotalPrice = menuItem.Price * itemRequest.Quantity,
                Variant = itemRequest.Variant,
                SpecialInstructions = itemRequest.SpecialInstructions
            };

            order.Items.Add(orderItem);
            subTotal += orderItem.TotalPrice;
        }

        // Calculate totals
        order.SubTotal = subTotal;
        order.DeliveryFee = 50; // Fixed delivery fee for now
        order.Tax = subTotal * 0.18m; // 18% GST
        order.Total = order.SubTotal + order.DeliveryFee + order.Tax;

        // Add status history
        order.StatusHistory.Add(new OrderStatusHistory
        {
            Status = OrderStatus.Pending,
            Timestamp = DateTime.UtcNow,
            Notes = "Order created",
            UpdatedBy = userId
        });

        var createdOrder = await _orderRepository.CreateAsync(order);
        _logger.LogInformation("Order created successfully with ID: {OrderId}", createdOrder.Id);

        return _mapper.Map<OrderDto>(createdOrder);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(string id)
    {
        _logger.LogInformation("Getting order by ID: {OrderId}", id);

        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null || order.IsDeleted)
        {
            return null;
        }

        return _mapper.Map<OrderDto>(order);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
    {
        _logger.LogInformation("Getting orders for user: {UserId}", userId);

        var orders = await _orderRepository.GetByUserIdAsync(userId);
        var activeOrders = orders.Where(o => !o.IsDeleted).OrderByDescending(o => o.CreatedAt);

        return _mapper.Map<IEnumerable<OrderDto>>(activeOrders);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByRestaurantIdAsync(string restaurantId)
    {
        _logger.LogInformation("Getting orders for restaurant: {RestaurantId}", restaurantId);

        var orders = await _orderRepository.GetByRestaurantIdAsync(restaurantId);
        var activeOrders = orders.Where(o => !o.IsDeleted).OrderByDescending(o => o.CreatedAt);

        return _mapper.Map<IEnumerable<OrderDto>>(activeOrders);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(string id, UpdateOrderStatusRequest request)
    {
        _logger.LogInformation("Updating order status: {OrderId} to {Status}", id, request.Status);

        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {id} not found");
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;

        // Add status history
        order.StatusHistory.Add(new OrderStatusHistory
        {
            Status = request.Status,
            Timestamp = DateTime.UtcNow,
            Notes = request.Notes,
            UpdatedBy = "System" // In real app, get from current user context
        });

        var updatedOrder = await _orderRepository.UpdateAsync(order);
        return _mapper.Map<OrderDto>(updatedOrder);
    }

    public async Task<bool> CancelOrderAsync(string id, string userId)
    {
        _logger.LogInformation("Cancelling order: {OrderId} by user: {UserId}", id, userId);

        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null || order.UserId != userId)
        {
            return false;
        }

        if (order.Status == OrderStatus.Delivered || order.Status == OrderStatus.Cancelled)
        {
            return false; // Cannot cancel delivered or already cancelled orders
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        order.StatusHistory.Add(new OrderStatusHistory
        {
            Status = OrderStatus.Cancelled,
            Timestamp = DateTime.UtcNow,
            Notes = "Order cancelled by user",
            UpdatedBy = userId
        });

        await _orderRepository.UpdateAsync(order);
        return true;
    }

    private static string GenerateOrderNumber()
    {
        return $"GP{DateTime.UtcNow:yyyyMMdd}{DateTime.UtcNow.Ticks % 100000:D5}";
    }
}
