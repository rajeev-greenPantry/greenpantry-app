using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace GreenPantry.Application.Services;

public class PaymentFactoryService : IPaymentFactoryService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PaymentFactoryService> _logger;

    public PaymentFactoryService(IServiceProvider serviceProvider, ILogger<PaymentFactoryService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public IPaymentService GetPaymentService(PaymentProvider provider)
    {
        return provider switch
        {
            PaymentProvider.Razorpay => _serviceProvider.GetRequiredService<IRazorpayPaymentService>(),
            PaymentProvider.Paytm => _serviceProvider.GetRequiredService<IPaytmPaymentService>(),
            PaymentProvider.PhonePe => _serviceProvider.GetRequiredService<IPhonePePaymentService>(),
            _ => throw new ArgumentException($"Unsupported payment provider: {provider}")
        };
    }

    public async Task<bool> IsProviderEnabledAsync(PaymentProvider provider)
    {
        try
        {
            var paymentService = GetPaymentService(provider);
            var config = await paymentService.GetPaymentConfigurationAsync(provider);
            return config.IsEnabled;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if provider {Provider} is enabled", provider);
            return false;
        }
    }

    public async Task<List<PaymentProvider>> GetEnabledProvidersAsync()
    {
        var enabledProviders = new List<PaymentProvider>();
        
        foreach (PaymentProvider provider in Enum.GetValues<PaymentProvider>())
        {
            if (await IsProviderEnabledAsync(provider))
            {
                enabledProviders.Add(provider);
            }
        }

        return enabledProviders;
    }
}

