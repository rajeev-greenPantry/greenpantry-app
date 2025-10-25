using GreenPantry.Application.DTOs.Payment;
using GreenPantry.Domain.Entities;
using GreenPantry.Domain.Enums;

namespace GreenPantry.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreatePaymentAsync(PaymentRequestDto request);
    Task<PaymentResponseDto> GenerateUPIQRAsync(UPIQRRequestDto request);
    Task<PaymentResponseDto> GetPaymentStatusAsync(string paymentId);
    Task<bool> VerifyWebhookAsync(WebhookVerificationDto verification);
    Task<PaymentResponseDto> ProcessWebhookAsync(string payload, PaymentProvider provider);
    Task<PaymentResponseDto> RefundPaymentAsync(string paymentId, decimal amount, string reason);
    Task<PaymentConfiguration> GetPaymentConfigurationAsync(PaymentProvider provider);
    Task<bool> UpdatePaymentConfigurationAsync(PaymentConfiguration configuration);
}

public interface IRazorpayPaymentService : IPaymentService
{
    Task<string> GenerateRazorpayUPIQRAsync(UPIQRRequestDto request);
    bool VerifyRazorpayWebhookAsync(string signature, string payload);
}

public interface IPaytmPaymentService : IPaymentService
{
    Task<string> GeneratePaytmUPIQRAsync(UPIQRRequestDto request);
    bool VerifyPaytmWebhookAsync(string signature, string payload);
}

public interface IPhonePePaymentService : IPaymentService
{
    Task<string> GeneratePhonePeUPIQRAsync(UPIQRRequestDto request);
    bool VerifyPhonePeWebhookAsync(string signature, string payload);
}

