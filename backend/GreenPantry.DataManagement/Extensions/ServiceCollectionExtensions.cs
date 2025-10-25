using GreenPantry.DataManagement;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace GreenPantry.DataManagement.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDataManagementServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register data management services
        services.AddScoped<DataManagementService>();
        services.AddScoped<DataSeeder>();
        services.AddScoped<DataConsistencyChecker>();
        
        // Register background sync service
        services.AddHostedService<DataSyncService>();
        
        // Register data management controller
        services.AddScoped<DataManagementController>();
        
        return services;
    }
}
