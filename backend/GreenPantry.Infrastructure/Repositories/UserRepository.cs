using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Entities;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Repositories;

public class UserRepository : BaseRepository<GreenPantry.Domain.Entities.User>, IUserRepository
{
    public UserRepository(Container container, ILogger<UserRepository> logger) 
        : base(container, logger)
    {
    }

    protected override string GetPartitionKey(GreenPantry.Domain.Entities.User entity)
    {
        return entity.Id;
    }

    public async Task<GreenPantry.Domain.Entities.User?> GetByEmailAsync(string email)
    {
        try
        {
            var query = "SELECT * FROM c WHERE LOWER(c.email) = @email AND c.isDeleted = false";
            var results = await QueryAsync(query, new { email = email.ToLowerInvariant() });
            return results.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email: {Email}", email);
            throw;
        }
    }

    public async Task<GreenPantry.Domain.Entities.User?> GetByRefreshTokenAsync(string refreshToken)
    {
        try
        {
            var query = "SELECT * FROM c WHERE c.refreshToken = @refreshToken AND c.isDeleted = false";
            var results = await QueryAsync(query, new { refreshToken });
            return results.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by refresh token");
            throw;
        }
    }

    public new async Task<GreenPantry.Domain.Entities.User?> GetByIdAsync(string id)
    {
        return await base.GetByIdAsync(id);
    }

    public new async Task<IEnumerable<GreenPantry.Domain.Entities.User>> GetAllAsync()
    {
        return await base.GetAllAsync();
    }

    public new async Task<GreenPantry.Domain.Entities.User> CreateAsync(GreenPantry.Domain.Entities.User user)
    {
        return await base.CreateAsync(user);
    }

    public new async Task<GreenPantry.Domain.Entities.User> UpdateAsync(GreenPantry.Domain.Entities.User user)
    {
        return await base.UpdateAsync(user);
    }

    public new async Task<bool> DeleteAsync(string id)
    {
        return await base.DeleteAsync(id);
    }
}
