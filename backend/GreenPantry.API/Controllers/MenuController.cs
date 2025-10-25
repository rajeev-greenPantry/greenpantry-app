using GreenPantry.Application.DTOs.Menu;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly ILogger<MenuController> _logger;

    public MenuController(IMenuService menuService, ILogger<MenuController> logger)
    {
        _menuService = menuService;
        _logger = logger;
    }

    [HttpGet("restaurant/{restaurantId}")]
    public async Task<ActionResult<IEnumerable<MenuCategoryDto>>> GetMenuByRestaurant(string restaurantId)
    {
        try
        {
            var menu = await _menuService.GetMenuByRestaurantIdAsync(restaurantId);
            return Ok(menu);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting menu for restaurant: {RestaurantId}", restaurantId);
            return StatusCode(500, new { message = "An error occurred while getting menu" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MenuItemDto>> GetMenuItem(string id)
    {
        try
        {
            var menuItem = await _menuService.GetMenuItemByIdAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            return Ok(menuItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting menu item: {MenuItemId}", id);
            return StatusCode(500, new { message = "An error occurred while getting menu item" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<MenuItemDto>> CreateMenuItem(MenuItemDto menuItem)
    {
        try
        {
            var createdMenuItem = await _menuService.CreateMenuItemAsync(menuItem);
            return CreatedAtAction(nameof(GetMenuItem), new { id = createdMenuItem.Id }, createdMenuItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating menu item");
            return StatusCode(500, new { message = "An error occurred while creating menu item" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<MenuItemDto>> UpdateMenuItem(string id, MenuItemDto menuItem)
    {
        try
        {
            var updatedMenuItem = await _menuService.UpdateMenuItemAsync(id, menuItem);
            return Ok(updatedMenuItem);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu item: {MenuItemId}", id);
            return StatusCode(500, new { message = "An error occurred while updating menu item" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult> DeleteMenuItem(string id)
    {
        try
        {
            var success = await _menuService.DeleteMenuItemAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting menu item: {MenuItemId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting menu item" });
        }
    }
}
