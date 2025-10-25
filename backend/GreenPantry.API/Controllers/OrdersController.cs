using GreenPantry.Application.DTOs.Order;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderRequest request)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var order = await _orderService.CreateOrderAsync(request, userId);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { message = "An error occurred while creating order" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(string id)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Check if user has access to this order
            var userId = User.FindFirst("userId")?.Value;
            var userRole = User.FindFirst("role")?.Value;
            
            if (order.UserId != userId && userRole != "Admin" && userRole != "Vendor")
            {
                return Forbid();
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order: {OrderId}", id);
            return StatusCode(500, new { message = "An error occurred while getting order" });
        }
    }

    [HttpGet("user/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByUser(string userId)
    {
        try
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for user: {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while getting orders" });
        }
    }

    [HttpGet("restaurant/{restaurantId}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByRestaurant(string restaurantId)
    {
        try
        {
            var orders = await _orderService.GetOrdersByRestaurantIdAsync(restaurantId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for restaurant: {RestaurantId}", restaurantId);
            return StatusCode(500, new { message = "An error occurred while getting orders" });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Vendor,Admin,Delivery")]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(string id, UpdateOrderStatusRequest request)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, request);
            return Ok(order);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status: {OrderId}", id);
            return StatusCode(500, new { message = "An error occurred while updating order status" });
        }
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelOrder(string id)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var success = await _orderService.CancelOrderAsync(id, userId);
            if (!success)
            {
                return BadRequest(new { message = "Unable to cancel order" });
            }

            return Ok(new { message = "Order cancelled successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling order: {OrderId}", id);
            return StatusCode(500, new { message = "An error occurred while cancelling order" });
        }
    }
}
