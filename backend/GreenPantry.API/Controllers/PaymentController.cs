using GreenPantry.Application.DTOs.Payment;
using GreenPantry.Application.Interfaces;
using GreenPantry.Domain.Enums;
using GreenPantry.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenPantry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentFactoryService _paymentFactory;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPaymentFactoryService paymentFactory, ILogger<PaymentController> logger)
    {
        _paymentFactory = paymentFactory;
        _logger = logger;
    }

    /// <summary>
    /// Create a new payment for an order
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult<PaymentResponseDto>> CreatePayment([FromBody] PaymentRequestDto request)
    {
        try
        {
            if (!await _paymentFactory.IsProviderEnabledAsync(request.Provider))
            {
                return BadRequest($"Payment provider {request.Provider} is not enabled");
            }

            var paymentService = _paymentFactory.GetPaymentService(request.Provider);
            var result = await paymentService.CreatePaymentAsync(request);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment for order {OrderId}", request.OrderId);
            return StatusCode(500, "An error occurred while creating the payment");
        }
    }

    /// <summary>
    /// Generate UPI QR code for an order
    /// </summary>
    [HttpPost("upi-qr")]
    public async Task<ActionResult<PaymentResponseDto>> GenerateUPIQR([FromBody] UPIQRRequestDto request)
    {
        try
        {
            if (!await _paymentFactory.IsProviderEnabledAsync(request.Provider))
            {
                return BadRequest($"Payment provider {request.Provider} is not enabled");
            }

            var paymentService = _paymentFactory.GetPaymentService(request.Provider);
            var result = await paymentService.GenerateUPIQRAsync(request);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating UPI QR for order {OrderId}", request.OrderId);
            return StatusCode(500, "An error occurred while generating UPI QR");
        }
    }

    /// <summary>
    /// Get payment status
    /// </summary>
    [HttpGet("status/{paymentId}")]
    public async Task<ActionResult<PaymentResponseDto>> GetPaymentStatus(string paymentId, [FromQuery] PaymentProvider provider)
    {
        try
        {
            if (!await _paymentFactory.IsProviderEnabledAsync(provider))
            {
                return BadRequest($"Payment provider {provider} is not enabled");
            }

            var paymentService = _paymentFactory.GetPaymentService(provider);
            var result = await paymentService.GetPaymentStatusAsync(paymentId);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment status for {PaymentId}", paymentId);
            return StatusCode(500, "An error occurred while getting payment status");
        }
    }

    /// <summary>
    /// Process refund for a payment
    /// </summary>
    [HttpPost("refund")]
    public async Task<ActionResult<PaymentResponseDto>> ProcessRefund([FromBody] RefundRequestDto request)
    {
        try
        {
            if (!await _paymentFactory.IsProviderEnabledAsync(request.Provider))
            {
                return BadRequest($"Payment provider {request.Provider} is not enabled");
            }

            var paymentService = _paymentFactory.GetPaymentService(request.Provider);
            var result = await paymentService.RefundPaymentAsync(request.PaymentId, request.Amount, request.Reason);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing refund for {PaymentId}", request.PaymentId);
            return StatusCode(500, "An error occurred while processing refund");
        }
    }

    /// <summary>
    /// Get enabled payment providers
    /// </summary>
    [HttpGet("providers")]
    public async Task<ActionResult<List<PaymentProvider>>> GetEnabledProviders()
    {
        try
        {
            var providers = await _paymentFactory.GetEnabledProvidersAsync();
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting enabled payment providers");
            return StatusCode(500, "An error occurred while getting payment providers");
        }
    }

    /// <summary>
    /// Get payment configuration for a provider
    /// </summary>
    [HttpGet("config/{provider}")]
    public async Task<ActionResult<PaymentConfiguration>> GetPaymentConfiguration(PaymentProvider provider)
    {
        try
        {
            var paymentService = _paymentFactory.GetPaymentService(provider);
            var config = await paymentService.GetPaymentConfigurationAsync(provider);
            
            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment configuration for {Provider}", provider);
            return StatusCode(500, "An error occurred while getting payment configuration");
        }
    }
}

/// <summary>
/// Webhook endpoints for payment providers (no authentication required)
/// </summary>
[ApiController]
[Route("api/[controller]/webhook")]
public class PaymentWebhookController : ControllerBase
{
    private readonly IPaymentFactoryService _paymentFactory;
    private readonly ILogger<PaymentWebhookController> _logger;

    public PaymentWebhookController(IPaymentFactoryService paymentFactory, ILogger<PaymentWebhookController> logger)
    {
        _paymentFactory = paymentFactory;
        _logger = logger;
    }

    /// <summary>
    /// Razorpay webhook endpoint
    /// </summary>
    [HttpPost("razorpay")]
    public async Task<IActionResult> RazorpayWebhook()
    {
        try
        {
            var signature = Request.Headers["X-Razorpay-Signature"].FirstOrDefault() ?? string.Empty;
            var payload = await new StreamReader(Request.Body).ReadToEndAsync();

            var paymentService = _paymentFactory.GetPaymentService(PaymentProvider.Razorpay);
            
            var razorpayService = paymentService as IRazorpayPaymentService;
            if (razorpayService == null || !razorpayService.VerifyRazorpayWebhookAsync(signature, payload))
            {
                _logger.LogWarning("Invalid Razorpay webhook signature");
                return BadRequest("Invalid signature");
            }

            var result = await paymentService.ProcessWebhookAsync(payload, PaymentProvider.Razorpay);
            
            // TODO: Update order status in database based on payment result
            _logger.LogInformation("Razorpay webhook processed successfully for payment {PaymentId}", result.PaymentId);
            
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Razorpay webhook");
            return StatusCode(500, "Webhook processing failed");
        }
    }

    /// <summary>
    /// Paytm webhook endpoint
    /// </summary>
    [HttpPost("paytm")]
    public async Task<IActionResult> PaytmWebhook()
    {
        try
        {
            var signature = Request.Headers["X-Paytm-Signature"].FirstOrDefault() ?? string.Empty;
            var payload = await new StreamReader(Request.Body).ReadToEndAsync();

            var paymentService = _paymentFactory.GetPaymentService(PaymentProvider.Paytm);
            
            var paytmService = paymentService as IPaytmPaymentService;
            if (paytmService == null || !paytmService.VerifyPaytmWebhookAsync(signature, payload))
            {
                _logger.LogWarning("Invalid Paytm webhook signature");
                return BadRequest("Invalid signature");
            }

            var result = await paymentService.ProcessWebhookAsync(payload, PaymentProvider.Paytm);
            
            // TODO: Update order status in database based on payment result
            _logger.LogInformation("Paytm webhook processed successfully for payment {PaymentId}", result.PaymentId);
            
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Paytm webhook");
            return StatusCode(500, "Webhook processing failed");
        }
    }

    /// <summary>
    /// PhonePe webhook endpoint
    /// </summary>
    [HttpPost("phonepe")]
    public async Task<IActionResult> PhonePeWebhook()
    {
        try
        {
            var signature = Request.Headers["X-Verify"].FirstOrDefault() ?? string.Empty;
            var payload = await new StreamReader(Request.Body).ReadToEndAsync();

            var paymentService = _paymentFactory.GetPaymentService(PaymentProvider.PhonePe);
            
            var phonePeService = paymentService as IPhonePePaymentService;
            if (phonePeService == null || !phonePeService.VerifyPhonePeWebhookAsync(signature, payload))
            {
                _logger.LogWarning("Invalid PhonePe webhook signature");
                return BadRequest("Invalid signature");
            }

            var result = await paymentService.ProcessWebhookAsync(payload, PaymentProvider.PhonePe);
            
            // TODO: Update order status in database based on payment result
            _logger.LogInformation("PhonePe webhook processed successfully for payment {PaymentId}", result.PaymentId);
            
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PhonePe webhook");
            return StatusCode(500, "Webhook processing failed");
        }
    }
}

public class RefundRequestDto
{
    public string PaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public PaymentProvider Provider { get; set; }
}

