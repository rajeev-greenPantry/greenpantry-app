using GreenPantry.Domain.Entities;
using GreenPantry.Domain.Enums;
using GreenPantry.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace GreenPantry.DataManagement;

public class DataManagementService
{
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly ILogger<DataManagementService> _logger;

    public DataManagementService(
        IRestaurantRepository restaurantRepository,
        IMenuItemRepository menuItemRepository,
        ILogger<DataManagementService> logger)
    {
        _restaurantRepository = restaurantRepository;
        _menuItemRepository = menuItemRepository;
        _logger = logger;
    }

    #region Restaurant Management

    public async Task<Restaurant> CreateOrUpdateRestaurantAsync(RestaurantData restaurantData)
    {
        _logger.LogInformation("Creating or updating restaurant: {RestaurantName}", restaurantData.Name);

        var existingRestaurant = await _restaurantRepository.GetByIdAsync(restaurantData.Id);
        
        if (existingRestaurant != null)
        {
            return await UpdateRestaurantAsync(existingRestaurant, restaurantData);
        }
        else
        {
            return await CreateRestaurantAsync(restaurantData);
        }
    }

    private async Task<Restaurant> CreateRestaurantAsync(RestaurantData restaurantData)
    {
        var restaurant = new Restaurant
        {
            Id = restaurantData.Id,
            Name = restaurantData.Name,
            Description = restaurantData.Description,
            ImageUrl = restaurantData.ImageUrl,
            City = restaurantData.City,
            State = restaurantData.State,
            Address = restaurantData.Address,
            PostalCode = restaurantData.PostalCode,
            Latitude = restaurantData.Latitude,
            Longitude = restaurantData.Longitude,
            PhoneNumber = restaurantData.PhoneNumber,
            Email = restaurantData.Email,
            CuisineTypes = restaurantData.CuisineTypes,
            Rating = restaurantData.Rating,
            ReviewCount = restaurantData.ReviewCount,
            DeliveryFee = restaurantData.DeliveryFee,
            EstimatedDeliveryTime = restaurantData.EstimatedDeliveryTime,
            IsActive = restaurantData.IsActive,
            OwnerId = restaurantData.OwnerId,
            ImageUrls = restaurantData.ImageUrls,
            Status = restaurantData.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        return await _restaurantRepository.CreateAsync(restaurant);
    }

    private async Task<Restaurant> UpdateRestaurantAsync(Restaurant existingRestaurant, RestaurantData restaurantData)
    {
        existingRestaurant.Name = restaurantData.Name;
        existingRestaurant.Description = restaurantData.Description;
        existingRestaurant.ImageUrl = restaurantData.ImageUrl;
        existingRestaurant.City = restaurantData.City;
        existingRestaurant.State = restaurantData.State;
        existingRestaurant.Address = restaurantData.Address;
        existingRestaurant.PostalCode = restaurantData.PostalCode;
        existingRestaurant.Latitude = restaurantData.Latitude;
        existingRestaurant.Longitude = restaurantData.Longitude;
        existingRestaurant.PhoneNumber = restaurantData.PhoneNumber;
        existingRestaurant.Email = restaurantData.Email;
        existingRestaurant.CuisineTypes = restaurantData.CuisineTypes;
        existingRestaurant.Rating = restaurantData.Rating;
        existingRestaurant.ReviewCount = restaurantData.ReviewCount;
        existingRestaurant.DeliveryFee = restaurantData.DeliveryFee;
        existingRestaurant.EstimatedDeliveryTime = restaurantData.EstimatedDeliveryTime;
        existingRestaurant.IsActive = restaurantData.IsActive;
        existingRestaurant.ImageUrls = restaurantData.ImageUrls;
        existingRestaurant.Status = restaurantData.Status;
        existingRestaurant.UpdatedAt = DateTime.UtcNow;

        return await _restaurantRepository.UpdateAsync(existingRestaurant);
    }

    public async Task<bool> UpdateRestaurantCuisinesAsync(string restaurantId, List<CuisineType> cuisineTypes)
    {
        _logger.LogInformation("Updating cuisines for restaurant: {RestaurantId}", restaurantId);

        var restaurant = await _restaurantRepository.GetByIdAsync(restaurantId);
        if (restaurant == null)
        {
            _logger.LogWarning("Restaurant not found: {RestaurantId}", restaurantId);
            return false;
        }

        restaurant.CuisineTypes = cuisineTypes;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _restaurantRepository.UpdateAsync(restaurant);
        return true;
    }

    public async Task<bool> UpdateRestaurantStatusAsync(string restaurantId, RestaurantStatus status)
    {
        _logger.LogInformation("Updating status for restaurant: {RestaurantId} to {Status}", restaurantId, status);

        var restaurant = await _restaurantRepository.GetByIdAsync(restaurantId);
        if (restaurant == null)
        {
            _logger.LogWarning("Restaurant not found: {RestaurantId}", restaurantId);
            return false;
        }

        restaurant.Status = status;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _restaurantRepository.UpdateAsync(restaurant);
        return true;
    }

    #endregion

    #region Menu Item Management

    public async Task<MenuItem> CreateOrUpdateMenuItemAsync(MenuItemData menuItemData)
    {
        _logger.LogInformation("Creating or updating menu item: {MenuItemName}", menuItemData.Name);

        var existingMenuItem = await _menuItemRepository.GetByIdAsync(menuItemData.Id);
        
        if (existingMenuItem != null)
        {
            return await UpdateMenuItemAsync(existingMenuItem, menuItemData);
        }
        else
        {
            return await CreateMenuItemAsync(menuItemData);
        }
    }

    private async Task<MenuItem> CreateMenuItemAsync(MenuItemData menuItemData)
    {
        var menuItem = new MenuItem
        {
            Id = menuItemData.Id,
            RestaurantId = menuItemData.RestaurantId,
            Name = menuItemData.Name,
            Description = menuItemData.Description,
            Price = menuItemData.Price,
            ImageUrl = menuItemData.ImageUrl,
            Category = menuItemData.Category,
            IsVegetarian = menuItemData.IsVegetarian,
            IsVegan = menuItemData.IsVegan,
            IsGlutenFree = menuItemData.IsGlutenFree,
            IsSpicy = menuItemData.IsSpicy,
            SpiceLevel = menuItemData.SpiceLevel,
            Allergens = menuItemData.Allergens,
            Ingredients = menuItemData.Ingredients,
            PreparationTime = menuItemData.PreparationTime,
            IsAvailable = menuItemData.IsAvailable,
            StockQuantity = menuItemData.StockQuantity,
            Variants = menuItemData.Variants.Select(v => new MenuItemVariant
            {
                Name = v.Name,
                PriceModifier = v.PriceModifier,
                IsDefault = v.IsDefault
            }).ToList(),
            Tags = menuItemData.Tags,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        return await _menuItemRepository.CreateAsync(menuItem);
    }

    private async Task<MenuItem> UpdateMenuItemAsync(MenuItem existingMenuItem, MenuItemData menuItemData)
    {
        existingMenuItem.Name = menuItemData.Name;
        existingMenuItem.Description = menuItemData.Description;
        existingMenuItem.Price = menuItemData.Price;
        existingMenuItem.ImageUrl = menuItemData.ImageUrl;
        existingMenuItem.Category = menuItemData.Category;
        existingMenuItem.IsVegetarian = menuItemData.IsVegetarian;
        existingMenuItem.IsVegan = menuItemData.IsVegan;
        existingMenuItem.IsGlutenFree = menuItemData.IsGlutenFree;
        existingMenuItem.IsSpicy = menuItemData.IsSpicy;
        existingMenuItem.SpiceLevel = menuItemData.SpiceLevel;
        existingMenuItem.Allergens = menuItemData.Allergens;
        existingMenuItem.Ingredients = menuItemData.Ingredients;
        existingMenuItem.PreparationTime = menuItemData.PreparationTime;
        existingMenuItem.IsAvailable = menuItemData.IsAvailable;
        existingMenuItem.StockQuantity = menuItemData.StockQuantity;
        existingMenuItem.Variants = menuItemData.Variants.Select(v => new MenuItemVariant
        {
            Name = v.Name,
            PriceModifier = v.PriceModifier,
            IsDefault = v.IsDefault
        }).ToList();
        existingMenuItem.Tags = menuItemData.Tags;
        existingMenuItem.UpdatedAt = DateTime.UtcNow;

        return await _menuItemRepository.UpdateAsync(existingMenuItem);
    }

    public async Task<bool> UpdateMenuItemAvailabilityAsync(string menuItemId, bool isAvailable)
    {
        _logger.LogInformation("Updating availability for menu item: {MenuItemId} to {IsAvailable}", menuItemId, isAvailable);

        var menuItem = await _menuItemRepository.GetByIdAsync(menuItemId);
        if (menuItem == null)
        {
            _logger.LogWarning("Menu item not found: {MenuItemId}", menuItemId);
            return false;
        }

        menuItem.IsAvailable = isAvailable;
        menuItem.UpdatedAt = DateTime.UtcNow;

        await _menuItemRepository.UpdateAsync(menuItem);
        return true;
    }

    public async Task<bool> UpdateMenuItemPriceAsync(string menuItemId, decimal newPrice)
    {
        _logger.LogInformation("Updating price for menu item: {MenuItemId} to {NewPrice}", menuItemId, newPrice);

        var menuItem = await _menuItemRepository.GetByIdAsync(menuItemId);
        if (menuItem == null)
        {
            _logger.LogWarning("Menu item not found: {MenuItemId}", menuItemId);
            return false;
        }

        menuItem.Price = newPrice;
        menuItem.UpdatedAt = DateTime.UtcNow;

        await _menuItemRepository.UpdateAsync(menuItem);
        return true;
    }

    public async Task<bool> UpdateMenuItemStockAsync(string menuItemId, int stockQuantity)
    {
        _logger.LogInformation("Updating stock for menu item: {MenuItemId} to {StockQuantity}", menuItemId, stockQuantity);

        var menuItem = await _menuItemRepository.GetByIdAsync(menuItemId);
        if (menuItem == null)
        {
            _logger.LogWarning("Menu item not found: {MenuItemId}", menuItemId);
            return false;
        }

        menuItem.StockQuantity = stockQuantity;
        menuItem.UpdatedAt = DateTime.UtcNow;

        await _menuItemRepository.UpdateAsync(menuItem);
        return true;
    }

    #endregion

    #region Bulk Operations

    public async Task<bool> BulkUpdateRestaurantsAsync(List<RestaurantData> restaurantsData)
    {
        _logger.LogInformation("Bulk updating {Count} restaurants", restaurantsData.Count);

        try
        {
            foreach (var restaurantData in restaurantsData)
            {
                await CreateOrUpdateRestaurantAsync(restaurantData);
            }
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk restaurant update");
            return false;
        }
    }

    public async Task<bool> BulkUpdateMenuItemsAsync(List<MenuItemData> menuItemsData)
    {
        _logger.LogInformation("Bulk updating {Count} menu items", menuItemsData.Count);

        try
        {
            foreach (var menuItemData in menuItemsData)
            {
                await CreateOrUpdateMenuItemAsync(menuItemData);
            }
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during bulk menu items update");
            return false;
        }
    }

    #endregion

    #region Data Validation

    public async Task<ValidationResult> ValidateRestaurantDataAsync(RestaurantData restaurantData)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(restaurantData.Name))
            result.AddError("Restaurant name is required");

        if (string.IsNullOrWhiteSpace(restaurantData.City))
            result.AddError("City is required");

        if (string.IsNullOrWhiteSpace(restaurantData.Address))
            result.AddError("Address is required");

        if (restaurantData.CuisineTypes == null || !restaurantData.CuisineTypes.Any())
            result.AddError("At least one cuisine type is required");

        if (restaurantData.Rating < 0 || restaurantData.Rating > 5)
            result.AddError("Rating must be between 0 and 5");

        if (restaurantData.DeliveryFee < 0)
            result.AddError("Delivery fee cannot be negative");

        if (restaurantData.EstimatedDeliveryTime <= 0)
            result.AddError("Estimated delivery time must be positive");

        return result;
    }

    public async Task<ValidationResult> ValidateMenuItemDataAsync(MenuItemData menuItemData)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(menuItemData.Name))
            result.AddError("Menu item name is required");

        if (string.IsNullOrWhiteSpace(menuItemData.RestaurantId))
            result.AddError("Restaurant ID is required");

        if (menuItemData.Price <= 0)
            result.AddError("Price must be positive");

        if (string.IsNullOrWhiteSpace(menuItemData.Category))
            result.AddError("Category is required");

        if (menuItemData.SpiceLevel < 0 || menuItemData.SpiceLevel > 5)
            result.AddError("Spice level must be between 0 and 5");

        if (menuItemData.PreparationTime <= 0)
            result.AddError("Preparation time must be positive");

        return result;
    }

    #endregion
}

#region Data Models

public class RestaurantData
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<CuisineType> CuisineTypes { get; set; } = new();
    public double Rating { get; set; } = 0.0;
    public int ReviewCount { get; set; } = 0;
    public decimal DeliveryFee { get; set; } = 0;
    public int EstimatedDeliveryTime { get; set; } = 30;
    public bool IsActive { get; set; } = true;
    public string OwnerId { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    public RestaurantStatus Status { get; set; } = RestaurantStatus.Pending;
}

public class MenuItemData
{
    public string Id { get; set; } = string.Empty;
    public string RestaurantId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; } = false;
    public bool IsVegan { get; set; } = false;
    public bool IsGlutenFree { get; set; } = false;
    public bool IsSpicy { get; set; } = false;
    public int SpiceLevel { get; set; } = 0;
    public List<string> Allergens { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public int PreparationTime { get; set; } = 15;
    public bool IsAvailable { get; set; } = true;
    public int StockQuantity { get; set; } = -1;
    public List<MenuItemVariantData> Variants { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}

public class MenuItemVariantData
{
    public string Name { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; } = 0;
    public bool IsDefault { get; set; } = false;
}

public class ValidationResult
{
    public List<string> Errors { get; set; } = new();
    public bool IsValid => !Errors.Any();

    public void AddError(string error)
    {
        Errors.Add(error);
    }
}

#endregion
