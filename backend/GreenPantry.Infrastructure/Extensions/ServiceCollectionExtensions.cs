using GreenPantry.Application.Interfaces;
using GreenPantry.Infrastructure.Data;
using GreenPantry.Infrastructure.Repositories;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add Cosmos DB context
        services.AddSingleton<CosmosDbContext>();

        // Add repositories
        services.AddScoped<IUserRepository>(provider =>
        {
            var context = provider.GetRequiredService<CosmosDbContext>();
            var container = context.GetContainer("Users");
            var logger = provider.GetRequiredService<ILogger<UserRepository>>();
            return new UserRepository(container, logger);
        });

        services.AddScoped<IRestaurantRepository>(provider =>
        {
            var context = provider.GetRequiredService<CosmosDbContext>();
            var container = context.GetContainer("Vendors");
            var logger = provider.GetRequiredService<ILogger<RestaurantRepository>>();
            return new RestaurantRepository(container, logger);
        });

        services.AddScoped<IMenuItemRepository>(provider =>
        {
            var context = provider.GetRequiredService<CosmosDbContext>();
            var container = context.GetContainer("Products");
            var logger = provider.GetRequiredService<ILogger<MenuItemRepository>>();
            return new MenuItemRepository(container, logger);
        });

        services.AddScoped<IOrderRepository>(provider =>
        {
            var context = provider.GetRequiredService<CosmosDbContext>();
            var container = context.GetContainer("Orders");
            var logger = provider.GetRequiredService<ILogger<OrderRepository>>();
            return new OrderRepository(container, logger);
        });

        return services;
    }
}
