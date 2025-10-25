using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.DTOs.Restaurant;

public class RestaurantDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public List<string> CuisineTypes { get; set; } = new();
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public decimal DeliveryFee { get; set; }
    public int EstimatedDeliveryTime { get; set; }
    public bool IsActive { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public string Status { get; set; } = string.Empty;
}

public class RestaurantDetailDto : RestaurantDto
{
    public string Email { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string PostalCode { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
}

public class RestaurantFilterDto
{
    public string? City { get; set; }
    public CuisineType? CuisineType { get; set; }
    public double? MinRating { get; set; }
    public double? MaxDistance { get; set; }
    public double? UserLatitude { get; set; }
    public double? UserLongitude { get; set; }
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
