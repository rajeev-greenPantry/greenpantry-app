using GreenPantry.Application.DTOs.Menu;

namespace GreenPantry.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<MenuCategoryDto>> GetMenuByRestaurantIdAsync(string restaurantId);
    Task<MenuItemDto?> GetMenuItemByIdAsync(string id);
    Task<MenuItemDto> CreateMenuItemAsync(MenuItemDto menuItem);
    Task<MenuItemDto> UpdateMenuItemAsync(string id, MenuItemDto menuItem);
    Task<bool> DeleteMenuItemAsync(string id);
    Task<IEnumerable<MenuItemDto>> GetMenuItemsByRestaurantAsync(string restaurantId);
}
