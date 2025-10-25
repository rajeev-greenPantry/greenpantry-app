using GreenPantry.Application.DTOs.Restaurant;

namespace GreenPantry.Application.Interfaces;

public interface IRestaurantService
{
    Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync(RestaurantFilterDto filter);
    Task<RestaurantDetailDto?> GetRestaurantByIdAsync(string id);
    Task<RestaurantDto> CreateRestaurantAsync(RestaurantDto restaurant);
    Task<RestaurantDto> UpdateRestaurantAsync(string id, RestaurantDto restaurant);
    Task<bool> DeleteRestaurantAsync(string id);
    Task<IEnumerable<RestaurantDto>> GetRestaurantsByOwnerAsync(string ownerId);
}
