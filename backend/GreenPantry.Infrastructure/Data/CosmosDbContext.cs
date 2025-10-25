using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Data;

public class CosmosDbContext
{
    private readonly CosmosClient _cosmosClient;
    private readonly Database _database;
    private readonly ILogger<CosmosDbContext> _logger;

    public CosmosDbContext(IConfiguration configuration, ILogger<CosmosDbContext> logger)
    {
        _logger = logger;
        
        var connectionString = configuration["CosmosDb:ConnectionString"];
        var databaseName = configuration["CosmosDb:DatabaseName"];

        if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(databaseName))
        {
            throw new InvalidOperationException("Cosmos DB connection string and database name must be configured");
        }

        var cosmosClientOptions = new CosmosClientOptions()
        {
            SerializerOptions = new CosmosSerializationOptions()
            {
                PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
            }
        };
        
        _cosmosClient = new CosmosClient(connectionString, cosmosClientOptions);
        _database = _cosmosClient.GetDatabase(databaseName);

        _logger.LogInformation("Cosmos DB context initialized for database: {DatabaseName}", databaseName);
    }

    public Container GetContainer(string containerName)
    {
        return _database.GetContainer(containerName);
    }

    public async Task<bool> DatabaseExistsAsync()
    {
        try
        {
            var database = await _cosmosClient.GetDatabase(_database.Id).ReadAsync();
            return database != null;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public async Task EnsureContainersExistAsync()
    {
        _logger.LogInformation("Ensuring Cosmos DB database and containers exist");

        // First, ensure the database exists
        Database database;
        try
        {
            var databaseResponse = await _cosmosClient.CreateDatabaseIfNotExistsAsync(_database.Id);
            database = databaseResponse.Database;
            _logger.LogInformation("Database {DatabaseName} ensured", _database.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create database {DatabaseName}", _database.Id);
            throw;
        }

        var containers = new[]
        {
            new { Name = "Users", PartitionKey = "/id" },
            new { Name = "Vendors", PartitionKey = "/city" },
            new { Name = "Products", PartitionKey = "/restaurantId" },
            new { Name = "Orders", PartitionKey = "/userId" }
        };

               foreach (var container in containers)
               {
                   try
                   {
                       // For serverless accounts, don't specify throughput
                       await database.CreateContainerIfNotExistsAsync(
                           container.Name,
                           container.PartitionKey);

                       _logger.LogInformation("Container {ContainerName} ensured", container.Name);
                   }
                   catch (ArgumentException ex) when (ex.Message.Contains("partition key path"))
                   {
                       _logger.LogWarning("Container {ContainerName} already exists with different partition key - skipping creation", container.Name);
                   }
                   catch (Exception ex)
                   {
                       _logger.LogError(ex, "Failed to create container {ContainerName}", container.Name);
                       // Don't throw here to allow the application to continue
                       _logger.LogWarning("Continuing without container {ContainerName}", container.Name);
                   }
               }
    }

    public void Dispose()
    {
        _cosmosClient?.Dispose();
    }
}
