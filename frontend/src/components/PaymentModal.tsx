import React, { useState } from 'react'
import { PaymentProvider, PaymentResponse, PaymentStatus } from '../types'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { UPIQRPayment } from './UPIQRPayment'
import { X, ArrowLeft } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
  onPaymentSuccess?: (payment: PaymentResponse) => void
  onPaymentFailed?: (error: string) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  customerName,
  customerEmail: _customerEmail,
  customerPhone,
  description,
  onPaymentSuccess,
  onPaymentFailed
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [, setSelectedProvider] = useState<PaymentProvider | undefined>()
  const [currentStep, setCurrentStep] = useState<'method' | 'payment'>('method')

  if (!isOpen) return null

  const handleMethodSelect = (method: string, provider?: PaymentProvider) => {
    setSelectedMethod(method)
    setSelectedProvider(provider)
    
    if (method === 'upi-qr' || method === 'upi-app') {
      setCurrentStep('payment')
    } else if (method === 'cod') {
      // Handle COD - no payment processing needed
      onPaymentSuccess?.({
        paymentId: `cod_${orderId}`,
        orderId,
        provider: PaymentProvider.Razorpay, // Dummy provider for COD
        status: PaymentStatus.Success,
        amount,
        currency: 'INR',
        providerTransactionId: `cod_${orderId}`
      })
      onClose()
    } else {
      // Handle card payments - redirect to payment gateway
      // This would typically open a payment gateway in a new window or redirect
      alert('Card payment integration pending')
    }
  }

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    onPaymentSuccess?.(payment)
    onClose()
  }

  const handlePaymentFailed = (error: string) => {
    onPaymentFailed?.(error)
  }

  const handleBack = () => {
    setCurrentStep('method')
    setSelectedMethod('')
    setSelectedProvider(undefined)
  }

  const handleClose = () => {
    setCurrentStep('method')
    setSelectedMethod('')
    setSelectedProvider(undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {currentStep === 'payment' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep === 'method' ? 'Payment' : 'Complete Payment'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'method' ? (
              <PaymentMethodSelector
                onMethodSelect={handleMethodSelect}
                selectedMethod={selectedMethod}
                amount={amount}
              />
            ) : (
              <UPIQRPayment
                orderId={orderId}
                amount={amount}
                customerName={customerName}
                customerPhone={customerPhone}
                description={description}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailed={handlePaymentFailed}
                onClose={handleBack}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Order ID: {orderId}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Total: ₹{amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




