using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.Interfaces;

public interface IPaymentFactoryService
{
    IPaymentService GetPaymentService(PaymentProvider provider);
    Task<bool> IsProviderEnabledAsync(PaymentProvider provider);
    Task<List<PaymentProvider>> GetEnabledProvidersAsync();
}



