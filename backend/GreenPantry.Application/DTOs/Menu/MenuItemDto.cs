using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.DTOs.Menu;

public class MenuItemDto
{
    public string Id { get; set; } = string.Empty;
    public string RestaurantId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; }
    public bool IsVegan { get; set; }
    public bool IsGlutenFree { get; set; }
    public bool IsSpicy { get; set; }
    public int SpiceLevel { get; set; }
    public List<string> Allergens { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public int PreparationTime { get; set; }
    public bool IsAvailable { get; set; }
    public int StockQuantity { get; set; }
    public List<MenuItemVariantDto> Variants { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}

public class MenuItemVariantDto
{
    public string Name { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; }
    public bool IsDefault { get; set; }
}

public class MenuCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public List<MenuItemDto> Items { get; set; } = new();
}
