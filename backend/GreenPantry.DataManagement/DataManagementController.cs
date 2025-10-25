using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GreenPantry.DataManagement;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for data management operations
public class DataManagementController : ControllerBase
{
    private readonly DataManagementService _dataManagementService;
    private readonly DataSeeder _dataSeeder;
    private readonly ILogger<DataManagementController> _logger;

    public DataManagementController(
        DataManagementService dataManagementService,
        DataSeeder dataSeeder,
        ILogger<DataManagementController> logger)
    {
        _dataManagementService = dataManagementService;
        _dataSeeder = dataSeeder;
        _logger = logger;
    }

    #region Restaurant Management

    [HttpPost("restaurants")]
    public async Task<IActionResult> CreateOrUpdateRestaurant([FromBody] RestaurantData restaurantData)
    {
        try
        {
            // Validate restaurant data
            var validationResult = await _dataManagementService.ValidateRestaurantDataAsync(restaurantData);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { errors = validationResult.Errors });
            }

            var restaurant = await _dataManagementService.CreateOrUpdateRestaurantAsync(restaurantData);
            return Ok(restaurant);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating/updating restaurant");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("restaurants/{restaurantId}/cuisines")]
    public async Task<IActionResult> UpdateRestaurantCuisines(
        string restaurantId, 
        [FromBody] List<CuisineType> cuisineTypes)
    {
        try
        {
            var success = await _dataManagementService.UpdateRestaurantCuisinesAsync(restaurantId, cuisineTypes);
            if (!success)
            {
                return NotFound(new { message = "Restaurant not found" });
            }

            return Ok(new { message = "Cuisines updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating restaurant cuisines");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("restaurants/{restaurantId}/status")]
    public async Task<IActionResult> UpdateRestaurantStatus(
        string restaurantId, 
        [FromBody] RestaurantStatus status)
    {
        try
        {
            var success = await _dataManagementService.UpdateRestaurantStatusAsync(restaurantId, status);
            if (!success)
            {
                return NotFound(new { message = "Restaurant not found" });
            }

            return Ok(new { message = "Restaurant status updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating restaurant status");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    #endregion

    #region Menu Item Management

    [HttpPost("menu-items")]
    public async Task<IActionResult> CreateOrUpdateMenuItem([FromBody] MenuItemData menuItemData)
    {
        try
        {
            // Validate menu item data
            var validationResult = await _dataManagementService.ValidateMenuItemDataAsync(menuItemData);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { errors = validationResult.Errors });
            }

            var menuItem = await _dataManagementService.CreateOrUpdateMenuItemAsync(menuItemData);
            return Ok(menuItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating/updating menu item");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("menu-items/{menuItemId}/availability")]
    public async Task<IActionResult> UpdateMenuItemAvailability(
        string menuItemId, 
        [FromBody] bool isAvailable)
    {
        try
        {
            var success = await _dataManagementService.UpdateMenuItemAvailabilityAsync(menuItemId, isAvailable);
            if (!success)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            return Ok(new { message = "Menu item availability updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu item availability");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("menu-items/{menuItemId}/price")]
    public async Task<IActionResult> UpdateMenuItemPrice(
        string menuItemId, 
        [FromBody] decimal newPrice)
    {
        try
        {
            var success = await _dataManagementService.UpdateMenuItemPriceAsync(menuItemId, newPrice);
            if (!success)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            return Ok(new { message = "Menu item price updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu item price");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("menu-items/{menuItemId}/stock")]
    public async Task<IActionResult> UpdateMenuItemStock(
        string menuItemId, 
        [FromBody] int stockQuantity)
    {
        try
        {
            var success = await _dataManagementService.UpdateMenuItemStockAsync(menuItemId, stockQuantity);
            if (!success)
            {
                return NotFound(new { message = "Menu item not found" });
            }

            return Ok(new { message = "Menu item stock updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu item stock");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    #endregion

    #region Bulk Operations

    [HttpPost("restaurants/bulk")]
    public async Task<IActionResult> BulkUpdateRestaurants([FromBody] List<RestaurantData> restaurantsData)
    {
        try
        {
            var success = await _dataManagementService.BulkUpdateRestaurantsAsync(restaurantsData);
            if (!success)
            {
                return StatusCode(500, new { message = "Bulk update failed" });
            }

            return Ok(new { message = $"Successfully updated {restaurantsData.Count} restaurants" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk restaurant update");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("menu-items/bulk")]
    public async Task<IActionResult> BulkUpdateMenuItems([FromBody] List<MenuItemData> menuItemsData)
    {
        try
        {
            var success = await _dataManagementService.BulkUpdateMenuItemsAsync(menuItemsData);
            if (!success)
            {
                return StatusCode(500, new { message = "Bulk update failed" });
            }

            return Ok(new { message = $"Successfully updated {menuItemsData.Count} menu items" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk menu items update");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    #endregion

    #region Data Seeding

    [HttpPost("seed/restaurants")]
    [Authorize(Roles = "Admin")] // Only admins can seed data
    public async Task<IActionResult> SeedRestaurants()
    {
        try
        {
            await _dataSeeder.SeedRestaurantsAsync();
            return Ok(new { message = "Restaurants seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding restaurants");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("seed/restaurants/public")]
    public async Task<IActionResult> SeedRestaurantsPublic()
    {
        try
        {
            await _dataSeeder.SeedRestaurantsAsync();
            return Ok(new { message = "Restaurants seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding restaurants");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("seed/menu-items")]
    [Authorize(Roles = "Admin")] // Only admins can seed data
    public async Task<IActionResult> SeedMenuItems()
    {
        try
        {
            await _dataSeeder.SeedMenuItemsAsync();
            return Ok(new { message = "Menu items seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding menu items");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("seed/all")]
    [Authorize(Roles = "Admin")] // Only admins can seed data
    public async Task<IActionResult> SeedAllData()
    {
        try
        {
            await _dataSeeder.SeedAllDataAsync();
            return Ok(new { message = "All data seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding all data");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("seed/all/public")]
    public async Task<IActionResult> SeedAllDataPublic()
    {
        try
        {
            await _dataSeeder.SeedAllDataAsync();
            return Ok(new { message = "All data seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding all data");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    #endregion

    #region Data Validation

    [HttpPost("validate/restaurant")]
    public async Task<IActionResult> ValidateRestaurant([FromBody] RestaurantData restaurantData)
    {
        try
        {
            var validationResult = await _dataManagementService.ValidateRestaurantDataAsync(restaurantData);
            return Ok(validationResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating restaurant data");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("validate/menu-item")]
    public async Task<IActionResult> ValidateMenuItem([FromBody] MenuItemData menuItemData)
    {
        try
        {
            var validationResult = await _dataManagementService.ValidateMenuItemDataAsync(menuItemData);
            return Ok(validationResult);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating menu item data");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    #endregion
}
