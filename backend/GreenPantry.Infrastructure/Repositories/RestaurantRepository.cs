using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Repositories;

public class RestaurantRepository : BaseRepository<Restaurant>, IRestaurantRepository
{
    public RestaurantRepository(Container container, ILogger<RestaurantRepository> logger) 
        : base(container, logger)
    {
    }

    protected override string GetPartitionKey(Restaurant entity)
    {
        return entity.Id;
    }

    public async Task<IEnumerable<Restaurant>> GetByOwnerIdAsync(string ownerId)
    {
        try
        {
            var query = "SELECT * FROM c WHERE c.ownerId = @ownerId AND c.isDeleted = false";
            return await QueryAsync(query, new { ownerId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting restaurants by owner: {OwnerId}", ownerId);
            throw;
        }
    }

    public new async Task<Restaurant?> GetByIdAsync(string id)
    {
        return await base.GetByIdAsync(id);
    }

    public new async Task<bool> DeleteAsync(string id)
    {
        return await base.DeleteAsync(id);
    }
}
