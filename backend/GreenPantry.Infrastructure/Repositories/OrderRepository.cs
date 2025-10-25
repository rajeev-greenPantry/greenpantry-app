using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(Container container, ILogger<OrderRepository> logger) 
        : base(container, logger)
    {
    }

    protected override string GetPartitionKey(Order entity)
    {
        return entity.UserId;
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(string userId)
    {
        try
        {
            var query = "SELECT * FROM c WHERE c.userId = @userId AND c.isDeleted = false ORDER BY c.createdAt DESC";
            return await QueryAsync(query, new { userId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders by user: {UserId}", userId);
            throw;
        }
    }

    public async Task<IEnumerable<Order>> GetByRestaurantIdAsync(string restaurantId)
    {
        try
        {
            var query = "SELECT * FROM c WHERE c.restaurantId = @restaurantId AND c.isDeleted = false ORDER BY c.createdAt DESC";
            return await QueryAsync(query, new { restaurantId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders by restaurant: {RestaurantId}", restaurantId);
            throw;
        }
    }

    public new async Task<Order?> GetByIdAsync(string id)
    {
        return await base.GetByIdAsync(id);
    }

    public new async Task<bool> DeleteAsync(string id)
    {
        return await base.DeleteAsync(id);
    }
}
