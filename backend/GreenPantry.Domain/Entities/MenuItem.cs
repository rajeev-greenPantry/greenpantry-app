using GreenPantry.Domain.Enums;

namespace GreenPantry.Domain.Entities;

public class MenuItem : BaseEntity
{
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
    public int SpiceLevel { get; set; } = 0; // 0-5 scale
    public List<string> Allergens { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public int PreparationTime { get; set; } = 15; // minutes
    public bool IsAvailable { get; set; } = true;
    public int StockQuantity { get; set; } = -1; // -1 for unlimited
    public List<MenuItemVariant> Variants { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}

public class MenuItemVariant
{
    public string Name { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; } = 0; // Additional price
    public bool IsDefault { get; set; } = false;
}
