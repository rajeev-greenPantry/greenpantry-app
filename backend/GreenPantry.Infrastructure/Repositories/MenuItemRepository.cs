using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Repositories;

public class MenuItemRepository : BaseRepository<MenuItem>, IMenuItemRepository
{
    public MenuItemRepository(Container container, ILogger<MenuItemRepository> logger) 
        : base(container, logger)
    {
    }

    protected override string GetPartitionKey(MenuItem entity)
    {
        return entity.RestaurantId;
    }

    public async Task<IEnumerable<MenuItem>> GetByRestaurantIdAsync(string restaurantId)
    {
        try
        {
            var query = "SELECT * FROM c WHERE c.restaurantId = @restaurantId AND c.isDeleted = false";
            return await QueryAsync(query, new { restaurantId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting menu items by restaurant: {RestaurantId}", restaurantId);
            throw;
        }
    }

    public new async Task<MenuItem?> GetByIdAsync(string id)
    {
        return await base.GetByIdAsync(id);
    }

    public new async Task<bool> DeleteAsync(string id)
    {
        return await base.DeleteAsync(id);
    }
}
