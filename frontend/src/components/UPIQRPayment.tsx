import React, { useState, useEffect } from 'react'
import { PaymentProvider, PaymentResponse, UPIQRRequest } from '../types'
import { paymentService } from '../services/paymentService'
import { toast } from 'react-hot-toast'
import { QrCode, Clock, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface UPIQRPaymentProps {
  orderId: string
  amount: number
  customerName: string
  customerPhone: string
  description: string
  onPaymentSuccess?: (payment: PaymentResponse) => void
  onPaymentFailed?: (error: string) => void
  onClose?: () => void
}

export const UPIQRPayment: React.FC<UPIQRPaymentProps> = ({
  orderId,
  amount,
  customerName,
  customerPhone,
  description,
  onPaymentSuccess,
  onPaymentFailed,
  onClose
}) => {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(PaymentProvider.Razorpay)
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [enabledProviders, setEnabledProviders] = useState<PaymentProvider[]>([])

  useEffect(() => {
    loadEnabledProviders()
  }, [])

  useEffect(() => {
    if (paymentResponse?.qrExpiresAt) {
      const expiryTime = new Date(paymentResponse.qrExpiresAt).getTime()
      const now = new Date().getTime()
      const timeDiff = Math.max(0, Math.floor((expiryTime - now) / 1000))
      setTimeLeft(timeDiff)

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [paymentResponse?.qrExpiresAt])

  const loadEnabledProviders = async () => {
    try {
      const providers = await paymentService.getEnabledProviders()
      setEnabledProviders(providers)
      if (providers.length > 0) {
        setSelectedProvider(providers[0])
      }
    } catch (error) {
      console.error('Failed to load enabled providers:', error)
      toast.error('Failed to load payment providers')
    }
  }

  const generateUPIQR = async () => {
    if (!selectedProvider) {
      toast.error('Please select a payment provider')
      return
    }

    setIsLoading(true)
    try {
      const request: UPIQRRequest = {
        orderId,
        amount,
        currency: 'INR',
        provider: selectedProvider,
        customerName,
        customerPhone,
        description,
        expiryMinutes: 15
      }

      const response = await paymentService.generateUPIQR(request)
      setPaymentResponse(response)
      toast.success('UPI QR code generated successfully')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate UPI QR code'
      toast.error(errorMessage)
      onPaymentFailed?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPayment = async () => {
    if (!paymentResponse) return

    setIsLoading(true)
    try {
      const response = await paymentService.getPaymentStatus(
        paymentResponse.paymentId,
        paymentResponse.provider
      )
      setPaymentResponse(response)

      if (response.status === 'Success') {
        toast.success('Payment successful!')
        onPaymentSuccess?.(response)
      } else if (response.status === 'Failed') {
        toast.error('Payment failed')
        onPaymentFailed?.('Payment failed')
      }
    } catch (error: any) {
      console.error('Failed to refresh payment status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'Failed':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'Processing':
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'Failed':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'Processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">UPI Payment</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div>Order ID: {orderId}</div>
          <div>Amount: {paymentService.formatAmount(amount)}</div>
          <div>Description: {description}</div>
        </div>
      </div>

      {/* Provider Selection */}
      {!paymentResponse && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Provider
          </label>
          <div className="grid grid-cols-1 gap-3">
            {enabledProviders.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedProvider === provider
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{paymentService.getProviderIcon(provider)}</span>
                  <span className="font-medium">{paymentService.getProviderDisplayName(provider)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate QR Button */}
      {!paymentResponse && (
        <button
          onClick={generateUPIQR}
          disabled={isLoading || !selectedProvider}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <QrCode className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Generating...' : 'Generate UPI QR Code'}</span>
        </button>
      )}

      {/* QR Code Display */}
      {paymentResponse && (
        <div className="space-y-4">
          {/* Payment Status */}
          <div className={`p-3 rounded-lg border-2 ${getStatusColor(paymentResponse.status)}`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon(paymentResponse.status)}
              <span className="font-medium">Payment Status: {paymentResponse.status}</span>
            </div>
          </div>

          {/* QR Code */}
          {paymentResponse.upiQRCode && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img
                  src={`data:image/png;base64,${paymentResponse.upiQRCode}`}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scan this QR code with any UPI app to pay
              </p>
            </div>
          )}

          {/* Timer */}
          {timeLeft > 0 && (
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                QR expires in {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={refreshPayment}
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            
            {paymentResponse.paymentUrl && (
              <button
                onClick={() => window.open(paymentResponse.paymentUrl, '_blank')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Open Payment Page
              </button>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to pay:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
              <li>2. Scan the QR code above</li>
              <li>3. Enter the amount: {paymentService.formatAmount(amount)}</li>
              <li>4. Complete the payment</li>
              <li>5. Click "Refresh Status" to check payment status</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}




