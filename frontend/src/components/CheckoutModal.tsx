import React, { useState, useEffect } from 'react'
import { PaymentModal } from './PaymentModal'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { PaymentProvider, PaymentResponse } from '../types'
import { useCart } from '../contexts/CartContext'
import { useAuthStore } from '../store/authStore'
import { X, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess?: (orderId: string) => void
}

interface DeliveryAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number
  longitude: number
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { state: cartState, clearCart } = useCart()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'processing'>('address')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | undefined>()
  const [, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  
  // Address form state
  const [address, setAddress] = useState<DeliveryAddress>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India',
    latitude: user?.address?.latitude || 0,
    longitude: user?.address?.longitude || 0
  })

  // Calculate totals
  const subtotal = cartState.total
  const deliveryFee = subtotal > 500 ? 0 : 50 // Free delivery over ₹500
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + deliveryFee + tax

  // Generate order number
  useEffect(() => {
    if (isOpen) {
      setOrderId(`GP${Date.now()}`)
    }
  }, [isOpen])

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      toast.error('Please fill in all required address fields')
      return
    }
    setCurrentStep('payment')
  }

  const handleMethodSelect = (method: string, provider?: PaymentProvider) => {
    setSelectedMethod(method)
    setSelectedProvider(provider)
    
    if (method === 'cod') {
      handleCODOrder()
    }
  }

  const handleCODOrder = async () => {
    setIsProcessing(true)
    try {
      // Create order for COD
      const orderData = {
        orderId,
        userId: user?.id || 'guest',
        restaurantId: cartState.items[0]?.restaurantId || '',
        items: cartState.items.map(item => ({
          menuItemId: item.id,
          menuItemName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          variant: '',
          specialInstructions: ''
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        deliveryAddress: address,
        paymentMethod: 'CashOnDelivery',
        paymentProvider: null,
        paymentStatus: 'Success',
        deliveryInstructions: ''
      }

      // TODO: Call API to create order
      console.log('Creating COD order:', orderData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Order placed successfully! You will pay on delivery.')
      clearCart()
      onOrderSuccess?.(orderId)
      onClose()
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    setIsProcessing(true)
    
    // Create order with payment details
    const orderData = {
      orderId,
      userId: user?.id || 'guest',
      restaurantId: cartState.items[0]?.restaurantId || '',
      items: cartState.items.map(item => ({
        menuItemId: item.id,
        menuItemName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        variant: '',
        specialInstructions: ''
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress: address,
      paymentMethod: selectedMethod === 'upi-qr' || selectedMethod === 'upi-app' ? 'UPI' : 'Card',
      paymentProvider: selectedProvider,
      paymentStatus: payment.status,
      paymentId: payment.paymentId,
      upiQRCode: payment.upiQRCode || '',
      deliveryInstructions: ''
    }

    // TODO: Call API to create order
    console.log('Creating paid order:', orderData)
    
    toast.success('Payment successful! Order placed.')
    clearCart()
    onOrderSuccess?.(orderId)
    onClose()
  }

  const handlePaymentFailed = (error: string) => {
    toast.error(`Payment failed: ${error}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Checkout
              </h2>
              <span className="text-sm text-gray-500">
                Order #{orderId}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'address' && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Form */}
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Delivery Address</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Order Summary (Compact) */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {cartState.itemCount} items
                    </span>
                    <span className="text-lg font-semibold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <PaymentMethodSelector
                  onMethodSelect={handleMethodSelect}
                  selectedMethod={selectedMethod}
                  amount={total}
                />

                {/* Payment Processing */}
                {selectedMethod && selectedMethod !== 'cod' && selectedProvider && (
                  <PaymentModal
                    isOpen={true}
                    onClose={() => setSelectedMethod('')}
                    orderId={orderId}
                    amount={total}
                    customerName={user?.firstName + ' ' + user?.lastName || 'Guest'}
                    customerEmail={user?.email || ''}
                    customerPhone={user?.phoneNumber || ''}
                    description={`GreenPantry Order #${orderId}`}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailed={handlePaymentFailed}
                  />
                )}
              </div>
            )}

            {currentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Processing your order...
                </h3>
                <p className="text-gray-600">
                  Please wait while we process your payment and create your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
