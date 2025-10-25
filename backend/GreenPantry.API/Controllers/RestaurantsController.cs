using GreenPantry.Application.DTOs.Restaurant;
using GreenPantry.Application.DTOs.Menu;
using GreenPantry.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;
    private readonly IMenuService _menuService;
    private readonly ILogger<RestaurantsController> _logger;

    public RestaurantsController(IRestaurantService restaurantService, IMenuService menuService, ILogger<RestaurantsController> logger)
    {
        _restaurantService = restaurantService;
        _menuService = menuService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantDto>>> GetRestaurants([FromQuery] RestaurantFilterDto filter)
    {
        try
        {
            var restaurants = await _restaurantService.GetRestaurantsAsync(filter);
            return Ok(restaurants);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting restaurants");
            return StatusCode(500, new { message = "An error occurred while getting restaurants" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RestaurantDetailDto>> GetRestaurant(string id)
    {
        try
        {
            var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting restaurant: {RestaurantId}", id);
            return StatusCode(500, new { message = "An error occurred while getting restaurant" });
        }
    }

    [HttpGet("{id}/menu")]
    public async Task<ActionResult<IEnumerable<MenuCategoryDto>>> GetRestaurantMenu(string id)
    {
        try
        {
            var menu = await _menuService.GetMenuByRestaurantIdAsync(id);
            return Ok(menu);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting restaurant menu: {RestaurantId}", id);
            return StatusCode(500, new { message = "An error occurred while getting menu" });
        }
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<RestaurantDto>> CreateRestaurant(RestaurantDto restaurant)
    {
        try
        {
            var createdRestaurant = await _restaurantService.CreateRestaurantAsync(restaurant);
            return CreatedAtAction(nameof(GetRestaurant), new { id = createdRestaurant.Id }, createdRestaurant);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating restaurant");
            return StatusCode(500, new { message = "An error occurred while creating restaurant" });
        }
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult<RestaurantDto>> UpdateRestaurant(string id, RestaurantDto restaurant)
    {
        try
        {
            var updatedRestaurant = await _restaurantService.UpdateRestaurantAsync(id, restaurant);
            return Ok(updatedRestaurant);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating restaurant: {RestaurantId}", id);
            return StatusCode(500, new { message = "An error occurred while updating restaurant" });
        }
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Vendor,Admin")]
    public async Task<ActionResult> DeleteRestaurant(string id)
    {
        try
        {
            var success = await _restaurantService.DeleteRestaurantAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting restaurant: {RestaurantId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting restaurant" });
        }
    }

    [HttpPost("seed-menus")]
    public async Task<ActionResult> SeedSampleMenus()
    {
        try
        {
            // Get all restaurants
            var restaurants = await _restaurantService.GetRestaurantsAsync(new RestaurantFilterDto());
            
                var menuItems = new List<object>
                {
                    // Pho Saigon Menu
                    new { RestaurantId = "pho-saigon", Name = "Pho Bo", Description = "Traditional Vietnamese beef noodle soup", Price = 299, Category = "Soup", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "pho-saigon", Name = "Pho Ga", Description = "Vietnamese chicken noodle soup", Price = 279, Category = "Soup", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "pho-saigon", Name = "Banh Mi", Description = "Vietnamese sandwich with pickled vegetables", Price = 199, Category = "Sandwich", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "pho-saigon", Name = "Spring Rolls", Description = "Fresh Vietnamese spring rolls with shrimp", Price = 149, Category = "Appetizer", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    
                    // Seoul Kitchen Menu
                    new { RestaurantId = "seoul-kitchen", Name = "Bulgogi", Description = "Korean marinated beef", Price = 399, Category = "Main Course", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "seoul-kitchen", Name = "Bibimbap", Description = "Korean mixed rice bowl", Price = 349, Category = "Main Course", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "seoul-kitchen", Name = "Kimchi", Description = "Traditional Korean fermented vegetables", Price = 99, Category = "Side", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "seoul-kitchen", Name = "Korean BBQ", Description = "Grilled marinated meat", Price = 449, Category = "Main Course", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    
                    // Test Restaurant Menu
                    new { RestaurantId = "restaurant-1", Name = "Chicken Curry", Description = "Spicy Indian chicken curry", Price = 349, Category = "Main Course", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "restaurant-1", Name = "Naan Bread", Description = "Fresh baked Indian bread", Price = 79, Category = "Bread", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "restaurant-1", Name = "Mango Lassi", Description = "Sweet yogurt drink with mango", Price = 99, Category = "Beverage", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" },
                    new { RestaurantId = "restaurant-1", Name = "Samosa", Description = "Crispy fried pastry with spiced filling", Price = 119, Category = "Appetizer", ImageUrl = "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center" }
                };

            return Ok(new { message = "Sample menu items created", menuItems = menuItems.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding menu items: {Error}", ex.Message);
            return StatusCode(500, new { message = "An error occurred while seeding menu items", error = ex.Message });
        }
    }

}
