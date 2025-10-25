# GreenPantry Payment Integration

This document describes the comprehensive payment integration system for GreenPantry, supporting Razorpay, Paytm, and PhonePe with UPI QR code generation.

## 🚀 Features

- **Multi-Provider Support**: Razorpay, Paytm, and PhonePe
- **UPI QR Code Generation**: Dynamic QR codes for each order
- **Secure Webhook Handling**: Verified webhook callbacks for all providers
- **Test Mode Configuration**: Easy switching between test and production modes
- **Real-time Payment Status**: Automatic status updates and polling
- **Clean Architecture**: Follows Clean Architecture principles with proper separation of concerns
- **Async/Await**: Modern async programming patterns throughout
- **Cosmos DB Integration**: Payment data stored in Cosmos DB
- **React Frontend**: Modern React components with TypeScript

## 🏗️ Architecture

### Backend (.NET Core)

```
GreenPantry.Domain/
├── Entities/
│   ├── Payment.cs
│   ├── PaymentConfiguration.cs
│   └── Order.cs (updated)
├── Enums/
│   ├── PaymentProvider.cs
│   ├── PaymentStatus.cs
│   └── UPIQRType.cs

GreenPantry.Application/
├── DTOs/Payment/
│   └── PaymentRequestDto.cs
├── Interfaces/
│   └── IPaymentService.cs
└── Services/
    ├── RazorpayPaymentService.cs
    ├── PaytmPaymentService.cs
    ├── PhonePePaymentService.cs
    └── PaymentFactoryService.cs

GreenPantry.API/
└── Controllers/
    └── PaymentController.cs
```

### Frontend (React + TypeScript)

```
src/
├── types/
│   └── index.ts (payment types added)
├── services/
│   └── paymentService.ts
└── components/
    ├── PaymentModal.tsx
    ├── PaymentMethodSelector.tsx
    ├── UPIQRPayment.tsx
    └── PaymentStatus.tsx
```

## 🔧 Configuration

### Backend Configuration

Add the following to your `appsettings.json`:

```json
{
  "PaymentProviders": {
    "Razorpay": {
      "IsEnabled": true,
      "IsTestMode": true,
      "ApiKey": "rzp_test_your_api_key_here",
      "ApiSecret": "your_api_secret_here",
      "WebhookSecret": "your_webhook_secret_here",
      "BaseUrl": "https://api.razorpay.com/v1",
      "TestBaseUrl": "https://api.razorpay.com/v1",
      "UPIId": "greenpantry@razorpay",
      "MerchantName": "GreenPantry",
      "QRExpiryMinutes": 15,
      "MinAmount": 1.0,
      "MaxAmount": 100000.0,
      "CallbackUrl": "https://your-domain.com/api/payment/webhook/razorpay"
    },
    "Paytm": {
      "IsEnabled": true,
      "IsTestMode": true,
      "MerchantId": "your_merchant_id_here",
      "MerchantKey": "your_merchant_key_here",
      "WebhookSecret": "your_webhook_secret_here",
      "BaseUrl": "https://securegw.paytm.in",
      "TestBaseUrl": "https://securegw-stage.paytm.in",
      "UPIId": "greenpantry@paytm",
      "MerchantName": "GreenPantry",
      "QRExpiryMinutes": 15,
      "MinAmount": 1.0,
      "MaxAmount": 100000.0,
      "CallbackUrl": "https://your-domain.com/api/payment/webhook/paytm"
    },
    "PhonePe": {
      "IsEnabled": true,
      "IsTestMode": true,
      "MerchantId": "your_merchant_id_here",
      "MerchantKey": "your_merchant_key_here",
      "WebhookSecret": "your_webhook_secret_here",
      "BaseUrl": "https://api.phonepe.com/apis/pg/v1",
      "TestBaseUrl": "https://api-preprod.phonepe.com/apis/pg-sandbox",
      "UPIId": "greenpantry@phonepe",
      "MerchantName": "GreenPantry",
      "QRExpiryMinutes": 15,
      "MinAmount": 1.0,
      "MaxAmount": 100000.0,
      "CallbackUrl": "https://your-domain.com/api/payment/webhook/phonepe",
      "RedirectUrl": "https://your-domain.com/payment/success",
      "RefundCallbackUrl": "https://your-domain.com/api/payment/webhook/phonepe/refund"
    }
  }
}
```

## 📡 API Endpoints

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create` | Create a new payment |
| POST | `/api/payment/upi-qr` | Generate UPI QR code |
| GET | `/api/payment/status/{paymentId}` | Get payment status |
| POST | `/api/payment/refund` | Process refund |
| GET | `/api/payment/providers` | Get enabled providers |
| GET | `/api/payment/config/{provider}` | Get provider configuration |

### Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/webhook/razorpay` | Razorpay webhook |
| POST | `/api/payment/webhook/paytm` | Paytm webhook |
| POST | `/api/payment/webhook/phonepe` | PhonePe webhook |

## 🔐 Security Features

- **Webhook Signature Verification**: All webhooks are verified using HMAC signatures
- **Secure Configuration**: Sensitive data stored in configuration with proper encryption
- **Test Mode Support**: Easy switching between test and production environments
- **Input Validation**: Comprehensive validation of all payment requests
- **Error Handling**: Secure error handling without exposing sensitive information

## 💳 Payment Flow

### UPI QR Payment Flow

1. **Order Creation**: Customer creates an order
2. **Payment Method Selection**: Customer selects UPI QR payment
3. **Provider Selection**: System shows available payment providers
4. **QR Generation**: System generates dynamic UPI QR code
5. **QR Display**: Customer scans QR with UPI app
6. **Payment Processing**: Payment is processed by UPI app
7. **Webhook Notification**: Provider sends webhook to update status
8. **Status Update**: Order status is updated in Cosmos DB
9. **Confirmation**: Customer receives payment confirmation

### Webhook Processing

1. **Webhook Received**: Provider sends webhook to our endpoint
2. **Signature Verification**: Webhook signature is verified
3. **Payload Processing**: Payment data is extracted and validated
4. **Database Update**: Order and payment status updated in Cosmos DB
5. **Response**: Appropriate response sent to provider

## 🧪 Testing

### Test Mode Configuration

All providers support test mode for development and testing:

```json
{
  "PaymentProviders": {
    "Razorpay": {
      "IsTestMode": true,
      "ApiKey": "rzp_test_development_key"
    }
  }
}
```

### Test Data

Use the following test data for development:

- **Razorpay Test Cards**: Use Razorpay's test card numbers
- **Paytm Test Mode**: Use Paytm's staging environment
- **PhonePe Sandbox**: Use PhonePe's pre-production environment

## 🚀 Deployment

### Prerequisites

1. **Payment Provider Accounts**: Set up accounts with Razorpay, Paytm, and PhonePe
2. **API Keys**: Obtain API keys and secrets from each provider
3. **Webhook URLs**: Configure webhook URLs in provider dashboards
4. **Cosmos DB**: Ensure Cosmos DB is properly configured

### Environment Variables

Set the following environment variables for production:

```bash
# Razorpay
RAZORPAY_API_KEY=your_production_api_key
RAZORPAY_API_SECRET=your_production_api_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Paytm
PAYTM_MERCHANT_ID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_WEBHOOK_SECRET=your_webhook_secret

# PhonePe
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_MERCHANT_KEY=your_merchant_key
PHONEPE_WEBHOOK_SECRET=your_webhook_secret
```

## 📱 Frontend Usage

### Basic Payment Modal

```tsx
import { PaymentModal } from './components/PaymentModal'

<PaymentModal
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  orderId="ORDER_123"
  amount={299.99}
  customerName="John Doe"
  customerEmail="john@example.com"
  customerPhone="+919876543210"
  description="GreenPantry Order"
  onPaymentSuccess={(payment) => {
    console.log('Payment successful:', payment)
    // Handle success
  }}
  onPaymentFailed={(error) => {
    console.error('Payment failed:', error)
    // Handle failure
  }}
/>
```

### Payment Status Tracking

```tsx
import { PaymentStatusComponent } from './components/PaymentStatus'

<PaymentStatusComponent
  paymentId="payment_123"
  provider={PaymentProvider.Razorpay}
  onStatusChange={(status) => {
    console.log('Payment status changed:', status)
  }}
  autoRefresh={true}
  refreshInterval={5000}
/>
```

## 🔧 Troubleshooting

### Common Issues

1. **Webhook Not Received**: Check webhook URL configuration and firewall settings
2. **Signature Verification Failed**: Verify webhook secret configuration
3. **QR Code Not Generated**: Check UPI ID configuration and provider settings
4. **Payment Status Not Updated**: Verify webhook processing and database updates

### Debug Mode

Enable debug logging in `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "GreenPantry.Application.Services": "Debug"
    }
  }
}
```

## 📊 Monitoring

### Key Metrics to Monitor

- Payment success rate by provider
- Webhook processing time
- QR code generation success rate
- Payment failure reasons
- Refund processing time

### Logging

All payment operations are logged with appropriate levels:
- **Info**: Successful operations
- **Warning**: Non-critical issues
- **Error**: Payment failures and errors
- **Debug**: Detailed operation information

## 🤝 Contributing

When adding new payment providers:

1. Create a new service implementing `IPaymentService`
2. Add provider-specific configuration
3. Update the `PaymentFactoryService`
4. Add webhook handling
5. Update frontend components
6. Add comprehensive tests

## 📄 License

This payment integration is part of the GreenPantry project and follows the same license terms.

## 🆘 Support

For issues related to payment integration:

1. Check the logs for error details
2. Verify configuration settings
3. Test with provider sandbox environments
4. Contact the development team

---

**Note**: This integration is designed for production use with proper security measures. Always test thoroughly in staging environments before deploying to production.
