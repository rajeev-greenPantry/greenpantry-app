using GreenPantry.Application.DTOs.Auth;
using GreenPantry.Application.DTOs.Order;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user profile");
            return StatusCode(500, new { message = "An error occurred while getting profile" });
        }
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UserDto user)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var updatedUser = await _userService.UpdateUserProfileAsync(userId, user);
            return Ok(updatedUser);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            return StatusCode(500, new { message = "An error occurred while updating profile" });
        }
    }

    [HttpPut("address")]
    public async Task<ActionResult> UpdateAddress(GreenPantry.Application.DTOs.Auth.AddressDto address)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var success = await _userService.UpdateUserAddressAsync(userId, address);
            if (!success)
            {
                return NotFound();
            }

            return Ok(new { message = "Address updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user address");
            return StatusCode(500, new { message = "An error occurred while updating address" });
        }
    }

    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrderHistory()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var orders = await _userService.GetUserOrderHistoryAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user order history");
            return StatusCode(500, new { message = "An error occurred while getting order history" });
        }
    }
}
