import React, { useState, useEffect } from 'react'
import { PaymentProvider, PaymentStatus, PaymentResponse } from '../types'
import { paymentService } from '../services/paymentService'
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react'

interface PaymentStatusProps {
  paymentId: string
  provider: PaymentProvider
  onStatusChange?: (status: PaymentStatus) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

export const PaymentStatusComponent: React.FC<PaymentStatusProps> = ({
  paymentId,
  provider,
  onStatusChange,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [payment, setPayment] = useState<PaymentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (paymentId && provider) {
      fetchPaymentStatus()
    }
  }, [paymentId, provider])

  useEffect(() => {
    if (autoRefresh && payment && payment.status === 'Pending') {
      const interval = setInterval(() => {
        fetchPaymentStatus()
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, payment, refreshInterval])

  const fetchPaymentStatus = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await paymentService.getPaymentStatus(paymentId, provider)
      setPayment(response)
      onStatusChange?.(response.status)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment status'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Success:
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case PaymentStatus.Failed:
        return <XCircle className="w-6 h-6 text-red-500" />
      case PaymentStatus.Processing:
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      case PaymentStatus.Cancelled:
        return <XCircle className="w-6 h-6 text-gray-500" />
      case PaymentStatus.Refunded:
        return <RefreshCw className="w-6 h-6 text-orange-500" />
      default:
        return <Clock className="w-6 h-6 text-yellow-500" />
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Success:
        return 'text-green-600 bg-green-50 border-green-200'
      case PaymentStatus.Failed:
        return 'text-red-600 bg-red-50 border-red-200'
      case PaymentStatus.Processing:
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case PaymentStatus.Cancelled:
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case PaymentStatus.Refunded:
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const getStatusMessage = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Success:
        return 'Payment completed successfully!'
      case PaymentStatus.Failed:
        return 'Payment failed. Please try again.'
      case PaymentStatus.Processing:
        return 'Payment is being processed...'
      case PaymentStatus.Cancelled:
        return 'Payment was cancelled.'
      case PaymentStatus.Refunded:
        return 'Payment has been refunded.'
      case PaymentStatus.PartiallyRefunded:
        return 'Payment has been partially refunded.'
      default:
        return 'Waiting for payment...'
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={fetchPaymentStatus}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Loading payment status...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Payment Status */}
      <div className={`p-4 rounded-lg border-2 ${getStatusColor(payment.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(payment.status)}
            <div>
              <h3 className="font-medium">{getStatusMessage(payment.status)}</h3>
              <p className="text-sm opacity-75">
                Payment ID: {payment.paymentId}
              </p>
            </div>
          </div>
          {isLoading && (
            <RefreshCw className="w-5 h-5 animate-spin" />
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{paymentService.formatAmount(payment.amount, payment.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">
              {paymentService.getProviderIcon(payment.provider)} {paymentService.getProviderDisplayName(payment.provider)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-xs">{payment.providerTransactionId}</span>
          </div>
          {payment.refundId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Refund ID:</span>
              <span className="font-mono text-xs">{payment.refundId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={fetchPaymentStatus}
          disabled={isLoading}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>

        {payment.status === PaymentStatus.Success && (
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Print Receipt
          </button>
        )}
      </div>

      {/* UPI QR Code (if available) */}
      {payment.upiQRCode && payment.status === PaymentStatus.Pending && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">UPI QR Code</h4>
          <div className="text-center">
            <img
              src={`data:image/png;base64,${payment.upiQRCode}`}
              alt="UPI QR Code"
              className="w-32 h-32 mx-auto"
            />
            <p className="text-sm text-gray-600 mt-2">
              Scan with any UPI app to complete payment
            </p>
          </div>
        </div>
      )}
    </div>
  )
}




