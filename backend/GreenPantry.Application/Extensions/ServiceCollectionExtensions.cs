using AutoMapper;
using FluentValidation;
using GreenPantry.Application.Interfaces;
using GreenPantry.Application.Mappings;
using GreenPantry.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace GreenPantry.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // Add FluentValidation
        services.AddValidatorsFromAssembly(typeof(ServiceCollectionExtensions).Assembly);

        // Add services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRestaurantService, RestaurantService>();
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddHttpClient<IGeolocationService, GeolocationService>();

        // Add payment services
        services.AddScoped<IPaymentFactoryService, PaymentFactoryService>();
        services.AddScoped<IRazorpayPaymentService, RazorpayPaymentService>();
        services.AddScoped<IPaytmPaymentService, PaytmPaymentService>();
        services.AddScoped<IPhonePePaymentService, PhonePePaymentService>();

        // Add email service
        services.AddScoped<EmailService>();

        return services;
    }
}
