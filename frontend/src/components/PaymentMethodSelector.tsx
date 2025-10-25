import React, { useState, useEffect } from 'react'
import { PaymentProvider } from '../types'
import { paymentService } from '../services/paymentService'
import { CreditCard, Smartphone, QrCode, Clock } from 'lucide-react'

interface PaymentMethodSelectorProps {
  onMethodSelect: (method: string, provider?: PaymentProvider) => void
  selectedMethod?: string
  amount: number
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onMethodSelect,
  selectedMethod,
  amount
}) => {
  const [enabledProviders, setEnabledProviders] = useState<PaymentProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEnabledProviders()
  }, [])

  const loadEnabledProviders = async () => {
    try {
      const providers = await paymentService.getEnabledProviders()
      setEnabledProviders(providers)
    } catch (error) {
      console.error('Failed to load enabled providers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const paymentMethods = [
    {
      id: 'upi-qr',
      name: 'UPI QR Code',
      description: 'Scan QR code with any UPI app',
      icon: <QrCode className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      hoverColor: 'hover:border-purple-300 hover:bg-purple-100',
      available: enabledProviders.length > 0
    },
    {
      id: 'upi-app',
      name: 'UPI Apps',
      description: 'Pay with PhonePe, Google Pay, Paytm',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      hoverColor: 'hover:border-blue-300 hover:bg-blue-100',
      available: enabledProviders.length > 0
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with your card',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'text-green-600 bg-green-50 border-green-200',
      hoverColor: 'hover:border-green-300 hover:bg-green-100',
      available: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      hoverColor: 'hover:border-orange-300 hover:bg-orange-100',
      available: true
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg p-4 h-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      
      {/* Amount Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">
            {paymentService.formatAmount(amount)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            disabled={!method.available}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedMethod === method.id
                ? `${method.color} border-current`
                : `border-gray-200 ${method.hoverColor} ${
                    method.available ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'
                  }`
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${method.available ? method.color.split(' ')[0] : 'text-gray-400'}`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{method.name}</h4>
                  {!method.available && (
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Provider Info for UPI */}
      {enabledProviders.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Available UPI Providers:</h4>
          <div className="flex flex-wrap gap-2">
            {enabledProviders.map((provider) => (
              <span
                key={provider}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                <span>{paymentService.getProviderIcon(provider)}</span>
                <span>{paymentService.getProviderDisplayName(provider)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Payment Security Info */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <h4 className="font-medium text-green-900 text-sm">Secure Payment</h4>
            <p className="text-xs text-green-700 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}




