import React, { useState } from 'react'
import { Clock, MapPin, Star, Repeat, Eye, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPeriod, setSelectedPeriod] = useState('All')

  const statuses = ['All', 'Delivered', 'In Progress', 'Cancelled', 'Refunded']
  const periods = ['All', 'This Week', 'This Month', 'Last 3 Months', 'This Year']

  const orders = [
    {
      id: 'ORD-001',
      restaurant: {
        name: 'Spice Garden',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100',
        rating: 4.5
      },
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 350 },
        { name: 'Dal Makhani', quantity: 1, price: 280 }
      ],
      total: 980,
      status: 'Delivered',
      orderDate: '2024-01-15T18:30:00Z',
      deliveryDate: '2024-01-15T19:15:00Z',
      deliveryAddress: '123 MG Road, Mumbai',
      paymentMethod: 'UPI',
      deliveryFee: 50,
      discount: 100
    },
    {
      id: 'ORD-002',
      restaurant: {
        name: 'Dragon Palace',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=100',
        rating: 4.3
      },
      items: [
        { name: 'Chicken Manchurian', quantity: 1, price: 320 },
        { name: 'Fried Rice', quantity: 1, price: 200 }
      ],
      total: 520,
      status: 'In Progress',
      orderDate: '2024-01-14T20:15:00Z',
      deliveryDate: null,
      deliveryAddress: '123 MG Road, Mumbai',
      paymentMethod: 'Credit Card',
      deliveryFee: 40,
      discount: 0
    },
    {
      id: 'ORD-003',
      restaurant: {
        name: 'Bella Vista',
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=100',
        rating: 4.7
      },
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 450 },
        { name: 'Caesar Salad', quantity: 1, price: 280 }
      ],
      total: 730,
      status: 'Delivered',
      orderDate: '2024-01-12T19:45:00Z',
      deliveryDate: '2024-01-12T20:30:00Z',
      deliveryAddress: '123 MG Road, Mumbai',
      paymentMethod: 'Cash on Delivery',
      deliveryFee: 60,
      discount: 50
    },
    {
      id: 'ORD-004',
      restaurant: {
        name: 'Thai Corner',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=100',
        rating: 4.4
      },
      items: [
        { name: 'Pad Thai', quantity: 1, price: 380 },
        { name: 'Tom Yum Soup', quantity: 1, price: 250 }
      ],
      total: 630,
      status: 'Cancelled',
      orderDate: '2024-01-10T21:00:00Z',
      deliveryDate: null,
      deliveryAddress: '123 MG Road, Mumbai',
      paymentMethod: 'UPI',
      deliveryFee: 45,
      discount: 0
    },
    {
      id: 'ORD-005',
      restaurant: {
        name: 'Burger Junction',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100',
        rating: 4.2
      },
      items: [
        { name: 'Classic Cheeseburger', quantity: 2, price: 250 },
        { name: 'Chicken Wings', quantity: 1, price: 280 }
      ],
      total: 780,
      status: 'Refunded',
      orderDate: '2024-01-08T17:20:00Z',
      deliveryDate: '2024-01-08T18:00:00Z',
      deliveryAddress: '123 MG Road, Mumbai',
      paymentMethod: 'Credit Card',
      deliveryFee: 35,
      discount: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Refunded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = orders.filter(order => {
    const statusMatch = selectedStatus === 'All' || order.status === selectedStatus
    // Add period filtering logic here if needed
    return statusMatch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order History</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Track and manage your past and current orders
          </p>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={order.restaurant.image}
                      alt={order.restaurant.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.restaurant.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {order.restaurant.rating}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Order #{order.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ordered on {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Items Ordered:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Delivery Address:</h4>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Method:</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">₹{order.total - order.deliveryFee + order.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Delivery Fee:</span>
                      <span className="text-gray-900 dark:text-white">₹{order.deliveryFee}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount:</span>
                        <span>-₹{order.discount}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-gray-900 dark:text-white">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Repeat className="w-4 h-4 mr-2" />
                      Reorder
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Star className="w-4 h-4 mr-2" />
                      Rate & Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Orders */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {selectedStatus === 'All' 
                ? "You haven't placed any orders yet."
                : `No orders found with status "${selectedStatus}".`
              }
            </p>
            <Link
              to="/restaurants"
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
