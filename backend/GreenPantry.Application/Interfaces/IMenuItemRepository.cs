using GreenPantry.Domain.Entities;

namespace GreenPantry.Application.Interfaces;

public interface IMenuItemRepository
{
    Task<MenuItem?> GetByIdAsync(string id);
    Task<IEnumerable<MenuItem>> GetByRestaurantIdAsync(string restaurantId);
    Task<MenuItem> CreateAsync(MenuItem menuItem);
    Task<MenuItem> UpdateAsync(MenuItem menuItem);
    Task<bool> DeleteAsync(string id);
}
