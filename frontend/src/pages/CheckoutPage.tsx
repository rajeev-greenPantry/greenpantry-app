import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { apiService } from '../services/api'
import { MapPin, CreditCard, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { PaymentMethod } from '../types/enums'
import { CreateOrderRequest } from '../types'

const checkoutSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: 'Mumbai',
      state: 'Maharashtra',
      paymentMethod: PaymentMethod.CashOnDelivery,
    },
  })

  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => apiService.createOrder(orderData),
    onSuccess: (response) => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/profile?order=${response.data.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)
    
    const orderData = {
      restaurantId: items[0].menuItem.restaurantId,
      items: items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        variant: item.variant,
        specialInstructions: item.specialInstructions,
      })),
      deliveryAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: 'India',
        latitude: 19.0760, // Default Mumbai coordinates
        longitude: 72.8777,
      },
      paymentMethod: data.paymentMethod,
      deliveryInstructions: data.deliveryInstructions || '',
    }

    createOrderMutation.mutate(orderData)
    setIsProcessing(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="btn btn-primary btn-lg"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Delivery Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">Street Address</label>
              <input
                {...register('street')}
                className="input"
                placeholder="Enter your street address"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input
                  {...register('city')}
                  className="input"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="label">State</label>
                <input
                  {...register('state')}
                  className="input"
                  placeholder="State"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Postal Code</label>
              <input
                {...register('postalCode')}
                className="input"
                placeholder="Postal code"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
              )}
            </div>

            <div>
              <label className="label">Delivery Instructions (Optional)</label>
              <textarea
                {...register('deliveryInstructions')}
                className="input"
                rows={3}
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {[
                { value: 'CashOnDelivery', label: 'Cash on Delivery', icon: '💵' },
                { value: 'UPI', label: 'UPI', icon: '📱' },
                { value: 'CreditCard', label: 'Credit Card', icon: '💳' },
                { value: 'DebitCard', label: 'Debit Card', icon: '💳' },
              ].map((method) => (
                <label key={method.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value={method.value}
                    className="mr-3"
                  />
                  <span className="text-lg mr-3">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Order Summary
          </h2>

          <div className="card p-6">
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.menuItem.id}-${item.variant}`} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ₹{item.menuItem.price + (item.menuItem.variants.find(v => v.name === item.variant)?.priceModifier || 0)}
                    </p>
                    {item.variant !== 'Regular' && (
                      <p className="text-xs text-gray-500">Variant: {item.variant}</p>
                    )}
                  </div>
                  <div className="font-medium">
                    ₹{((item.menuItem.price + (item.menuItem.variants.find(v => v.name === item.variant)?.priceModifier || 0)) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || createOrderMutation.isPending}
              className="btn btn-primary btn-lg w-full mt-6"
            >
              {isProcessing || createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
