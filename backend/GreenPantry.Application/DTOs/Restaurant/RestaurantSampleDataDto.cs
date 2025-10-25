namespace GreenPantry.Application.DTOs.Restaurant;

/// <summary>
/// DTO for restaurant sample data insertion from JSON files
/// Uses lowercase property names to match JSON structure
/// </summary>
public class RestaurantSampleDataDto
{
    public string id { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public string imageUrl { get; set; } = string.Empty;
    public string city { get; set; } = string.Empty;
    public string state { get; set; } = string.Empty;
    public string address { get; set; } = string.Empty;
    public string postalCode { get; set; } = string.Empty;
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string phoneNumber { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public List<string> cuisineTypes { get; set; } = new List<string>();
    public double rating { get; set; }
    public int reviewCount { get; set; }
    public decimal deliveryFee { get; set; }
    public int estimatedDeliveryTime { get; set; }
    public bool isActive { get; set; }
    public string ownerId { get; set; } = string.Empty;
    public List<string> imageUrls { get; set; } = new List<string>();
    public string status { get; set; } = string.Empty;
}
