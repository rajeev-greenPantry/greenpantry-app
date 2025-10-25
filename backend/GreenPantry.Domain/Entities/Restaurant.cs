using GreenPantry.Domain.Enums;

namespace GreenPantry.Domain.Entities;

public class Restaurant : BaseEntity
{
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
    public int EstimatedDeliveryTime { get; set; } = 30; // minutes
    public bool IsActive { get; set; } = true;
    public string OwnerId { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    public RestaurantStatus Status { get; set; } = RestaurantStatus.Pending;
}

