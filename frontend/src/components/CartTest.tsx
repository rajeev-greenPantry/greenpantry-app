import React from 'react'
import { useCart } from '../contexts/CartContext'
import { CheckoutModal } from './CheckoutModal'
import { useState } from 'react'

export const CartTest: React.FC = () => {
  const { state, addItem, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const addTestItem = () => {
    addItem({
      id: 'test-item-1',
      name: 'Test Burger',
      description: 'A delicious test burger',
      price: 299.99,
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: 'test-restaurant',
      restaurantName: 'Test Restaurant'
    })
  }

  const addAnotherItem = () => {
    addItem({
      id: 'test-item-2',
      name: 'Test Pizza',
      description: 'A delicious test pizza',
      price: 399.99,
      imageUrl: 'https://via.placeholder.com/150',
      restaurantId: 'test-restaurant',
      restaurantName: 'Test Restaurant'
    })
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Cart Integration Test</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Cart State:</h3>
          <p>Items: {state.itemCount}</p>
          <p>Total: ₹{state.total.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={addTestItem}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Test Burger (₹299.99)
          </button>
          
          <button
            onClick={addAnotherItem}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Test Pizza (₹399.99)
          </button>
          
          <button
            onClick={clearCart}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Clear Cart
          </button>
          
          {state.itemCount > 0 && (
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Test Checkout (₹{state.total.toFixed(2)})
            </button>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Cart Items:</h4>
            <div className="space-y-2">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span className="text-sm">{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onOrderSuccess={(orderId) => {
          console.log('Test order successful:', orderId)
          alert(`Test order successful! Order ID: ${orderId}`)
        }}
      />
    </div>
  )
}



