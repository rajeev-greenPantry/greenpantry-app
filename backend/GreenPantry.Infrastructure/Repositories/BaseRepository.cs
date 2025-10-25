using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Repositories;

public abstract class BaseRepository<T> where T : class
{
    protected readonly Container _container;
    protected readonly ILogger _logger;

    protected BaseRepository(Container container, ILogger logger)
    {
        _container = container;
        _logger = logger;
    }

    protected virtual string GetPartitionKey(T entity)
    {
        // Override in derived classes to provide partition key logic
        return "default";
    }

    public virtual async Task<T?> GetByIdAsync(string id, string? partitionKey = null)
    {
        try
        {
            var response = await _container.ReadItemAsync<T>(id, new PartitionKey(partitionKey ?? id));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting entity by ID: {Id}", id);
            throw;
        }
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        try
        {
            var query = _container.GetItemQueryIterator<T>();
            var results = new List<T>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all entities");
            throw;
        }
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        try
        {
            var response = await _container.CreateItemAsync(entity, new PartitionKey(GetPartitionKey(entity)));
            return response.Resource;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating entity");
            throw;
        }
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        try
        {
            var response = await _container.UpsertItemAsync(entity, new PartitionKey(GetPartitionKey(entity)));
            return response.Resource;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating entity");
            throw;
        }
    }

    public virtual async Task<bool> DeleteAsync(string id, string? partitionKey = null)
    {
        try
        {
            await _container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey ?? id));
            return true;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting entity with ID: {Id}", id);
            throw;
        }
    }

    protected virtual async Task<IEnumerable<T>> QueryAsync(string query, object? parameters = null)
    {
        try
        {
            var queryDefinition = new QueryDefinition(query);
            if (parameters != null)
            {
                foreach (var prop in parameters.GetType().GetProperties())
                {
                    queryDefinition.WithParameter($"@{prop.Name}", prop.GetValue(parameters));
                }
            }

            var queryIterator = _container.GetItemQueryIterator<T>(queryDefinition);
            var results = new List<T>();

            while (queryIterator.HasMoreResults)
            {
                var response = await queryIterator.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing query: {Query}", query);
            throw;
        }
    }
}
