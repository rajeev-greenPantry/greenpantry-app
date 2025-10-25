import api from './api'
import { PaymentRequest, UPIQRRequest, PaymentResponse, RefundRequest, PaymentProvider, PaymentConfiguration } from '../types'

export class PaymentService {
  private baseUrl = '/api/payment'

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await api.post(`${this.baseUrl}/create`, request)
    return response.data
  }

  async generateUPIQR(request: UPIQRRequest): Promise<PaymentResponse> {
    const response = await api.post(`${this.baseUrl}/upi-qr`, request)
    return response.data
  }

  async getPaymentStatus(paymentId: string, provider: PaymentProvider): Promise<PaymentResponse> {
    const response = await api.get(`${this.baseUrl}/status/${paymentId}?provider=${provider}`)
    return response.data
  }

  async processRefund(request: RefundRequest): Promise<PaymentResponse> {
    const response = await api.post(`${this.baseUrl}/refund`, request)
    return response.data
  }

  async getEnabledProviders(): Promise<PaymentProvider[]> {
    const response = await api.get(`${this.baseUrl}/providers`)
    return response.data
  }

  async getPaymentConfiguration(provider: PaymentProvider): Promise<PaymentConfiguration> {
    const response = await api.get(`${this.baseUrl}/config/${provider}`)
    return response.data
  }

  // Utility method to format amount for display
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Utility method to get provider display name
  getProviderDisplayName(provider: PaymentProvider): string {
    switch (provider) {
      case PaymentProvider.Razorpay:
        return 'Razorpay'
      case PaymentProvider.Paytm:
        return 'Paytm'
      case PaymentProvider.PhonePe:
        return 'PhonePe'
      default:
        return provider
    }
  }

  // Utility method to get provider icon
  getProviderIcon(provider: PaymentProvider): string {
    switch (provider) {
      case PaymentProvider.Razorpay:
        return '💳'
      case PaymentProvider.Paytm:
        return '📱'
      case PaymentProvider.PhonePe:
        return '📞'
      default:
        return '💳'
    }
  }
}

export const paymentService = new PaymentService()

