import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const CartPage = () => {
  const { items, subtotal, deliveryFee, tax, total, updateQuantity, removeItem, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious food to get started!</p>
          <Link to="/restaurants" className="btn btn-primary btn-lg">
            Browse Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.menuItem.id}-${item.variant}`} className="card p-4">
                <div className="flex gap-4">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                    <p className="text-sm text-gray-600">{item.menuItem.description}</p>
                    
                    {item.variant !== 'Regular' && (
                      <p className="text-sm text-gray-500 mt-1">Variant: {item.variant}</p>
                    )}
                    
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-500 mt-1">
                        Special: {item.specialInstructions}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{item.menuItem.price + (item.menuItem.variants.find(v => v.name === item.variant)?.priceModifier || 0)}
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1, item.variant)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1, item.variant)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.menuItem.id, item.variant)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="btn btn-primary btn-lg w-full"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg w-full"
                >
                  Login to Checkout
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline btn-lg w-full"
                >
                  Create Account
                </Link>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing an order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
