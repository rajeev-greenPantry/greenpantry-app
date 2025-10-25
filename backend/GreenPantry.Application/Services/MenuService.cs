using AutoMapper;
using GreenPantry.Application.DTOs.Menu;
using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Application.Services;

public class MenuService : IMenuService
{
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<MenuService> _logger;

    public MenuService(
        IMenuItemRepository menuItemRepository,
        IMapper mapper,
        ILogger<MenuService> logger)
    {
        _menuItemRepository = menuItemRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<MenuCategoryDto>> GetMenuByRestaurantIdAsync(string restaurantId)
    {
        _logger.LogInformation("Getting menu for restaurant: {RestaurantId}", restaurantId);

        var menuItems = await _menuItemRepository.GetByRestaurantIdAsync(restaurantId);
        var availableItems = menuItems.Where(m => m.IsAvailable && !m.IsDeleted);

        var groupedItems = availableItems
            .GroupBy(m => m.Category)
            .Select(g => new MenuCategoryDto
            {
                Category = g.Key,
                Items = _mapper.Map<List<MenuItemDto>>(g.ToList())
            })
            .OrderBy(c => c.Category);

        return groupedItems;
    }

    public async Task<MenuItemDto?> GetMenuItemByIdAsync(string id)
    {
        _logger.LogInformation("Getting menu item by ID: {MenuItemId}", id);

        var menuItem = await _menuItemRepository.GetByIdAsync(id);
        if (menuItem == null || menuItem.IsDeleted)
        {
            return null;
        }

        return _mapper.Map<MenuItemDto>(menuItem);
    }

    public async Task<MenuItemDto> CreateMenuItemAsync(MenuItemDto menuItem)
    {
        _logger.LogInformation("Creating new menu item: {MenuItemName}", menuItem.Name);

        var menuItemEntity = _mapper.Map<MenuItem>(menuItem);
        menuItemEntity.CreatedAt = DateTime.UtcNow;
        menuItemEntity.UpdatedAt = DateTime.UtcNow;

        var createdMenuItem = await _menuItemRepository.CreateAsync(menuItemEntity);
        return _mapper.Map<MenuItemDto>(createdMenuItem);
    }

    public async Task<MenuItemDto> UpdateMenuItemAsync(string id, MenuItemDto menuItem)
    {
        _logger.LogInformation("Updating menu item: {MenuItemId}", id);

        var existingMenuItem = await _menuItemRepository.GetByIdAsync(id);
        if (existingMenuItem == null)
        {
            throw new KeyNotFoundException($"Menu item with ID {id} not found");
        }

        _mapper.Map(menuItem, existingMenuItem);
        existingMenuItem.UpdatedAt = DateTime.UtcNow;

        var updatedMenuItem = await _menuItemRepository.UpdateAsync(existingMenuItem);
        return _mapper.Map<MenuItemDto>(updatedMenuItem);
    }

    public async Task<bool> DeleteMenuItemAsync(string id)
    {
        _logger.LogInformation("Deleting menu item: {MenuItemId}", id);

        var menuItem = await _menuItemRepository.GetByIdAsync(id);
        if (menuItem == null)
        {
            return false;
        }

        menuItem.IsDeleted = true;
        menuItem.UpdatedAt = DateTime.UtcNow;
        await _menuItemRepository.UpdateAsync(menuItem);

        return true;
    }

    public async Task<IEnumerable<MenuItemDto>> GetMenuItemsByRestaurantAsync(string restaurantId)
    {
        _logger.LogInformation("Getting menu items for restaurant: {RestaurantId}", restaurantId);

        var menuItems = await _menuItemRepository.GetByRestaurantIdAsync(restaurantId);
        var availableItems = menuItems.Where(m => !m.IsDeleted);

        return _mapper.Map<IEnumerable<MenuItemDto>>(availableItems);
    }
}
