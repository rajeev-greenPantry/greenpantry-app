import React, { useState } from 'react'
import { RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, CreditCard, Phone, Mail } from 'lucide-react'

const RefundPage = () => {
  const [selectedReason, setSelectedReason] = useState('')
  const [orderId, setOrderId] = useState('')
  const [description, setDescription] = useState('')

  const refundReasons = [
    { id: 'food-quality', label: 'Poor food quality', description: 'Food was cold, spoiled, or not as described' },
    { id: 'wrong-order', label: 'Wrong order received', description: 'Received different items than ordered' },
    { id: 'late-delivery', label: 'Extremely late delivery', description: 'Order arrived significantly later than promised' },
    { id: 'missing-items', label: 'Missing items', description: 'Some items from the order were not delivered' },
    { id: 'damaged-package', label: 'Damaged packaging', description: 'Food packaging was damaged during delivery' },
    { id: 'cancelled-by-restaurant', label: 'Cancelled by restaurant', description: 'Restaurant cancelled the order after confirmation' },
    { id: 'other', label: 'Other reason', description: 'Please describe your issue in detail' }
  ]

  const refundPolicies = [
    {
      category: 'Food Quality Issues',
      timeframe: 'Within 2 hours of delivery',
      process: 'Contact customer support immediately with photos if possible',
      refund: 'Full refund or replacement order'
    },
    {
      category: 'Wrong Order',
      timeframe: 'Within 1 hour of delivery',
      process: 'Report immediately via app or phone',
      refund: 'Full refund or correct order delivery'
    },
    {
      category: 'Late Delivery',
      timeframe: 'Within 24 hours',
      process: 'Contact support with order details',
      refund: 'Partial refund (delivery fee + 20% of order value)'
    },
    {
      category: 'Missing Items',
      timeframe: 'Within 2 hours of delivery',
      process: 'Report missing items immediately',
      refund: 'Refund for missing items or replacement delivery'
    },
    {
      category: 'Order Cancellation',
      timeframe: 'Before preparation starts',
      process: 'Cancel through app or contact support',
      refund: 'Full refund within 5-7 business days'
    }
  ]

  const handleRefundRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason || !orderId) {
      alert('Please fill in all required fields')
      return
    }
    // In a real app, this would submit the refund request
    console.log('Refund request submitted:', { selectedReason, orderId, description })
    alert('Your refund request has been submitted. We will review it within 24 hours.')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: January 15, 2024
          </p>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <RotateCcw className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Refund Promise</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              At GreenPantry, we want you to be completely satisfied with your order. If you're not happy with your 
              food delivery experience, we're here to make it right. Our refund policy is designed to be fair, 
              transparent, and customer-friendly.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We process refunds for valid reasons within our specified timeframes. Please read our policy carefully 
              and contact us if you have any questions.
            </p>
          </div>

          {/* Refund Policies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Refund Policies by Category</h2>
            
            <div className="space-y-6">
              {refundPolicies.map((policy, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {policy.category}
                    </h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                      {policy.timeframe}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Process:</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{policy.process}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Refund:</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{policy.refund}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Request a Refund</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Reach out within the specified timeframe using our app, phone, or email
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Provide Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share your order number, issue description, and any supporting photos
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Refund</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We'll review your request and process the refund within 24-48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Refund Request Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Request a Refund</h2>
            
            <form onSubmit={handleRefundRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., ORD-123456)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Refund *
                </label>
                <div className="space-y-3">
                  {refundReasons.map((reason) => (
                    <label key={reason.id} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{reason.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{reason.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide any additional details about your issue..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Submit Refund Request
              </button>
            </form>
          </div>

          {/* Refund Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Refund Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-900 dark:text-white">Refund request submitted</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-900 dark:text-white">Review within 24 hours</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-900 dark:text-white">Refund processed within 5-7 business days</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-900 dark:text-white">Amount credited to your original payment method</span>
              </div>
            </div>
          </div>

          {/* Non-Refundable Items */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Non-Refundable Items</h3>
            </div>
            <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
              <li>Orders cancelled after preparation has started</li>
              <li>Custom or special dietary orders (unless there's a quality issue)</li>
              <li>Orders delivered to the wrong address due to customer error</li>
              <li>Refund requests made after 48 hours of delivery</li>
              <li>Orders where the customer was not available to receive delivery</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-green-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help with Your Refund?</h2>
            <p className="text-green-100 mb-6">
              Our customer support team is here to help you with any refund-related questions or issues.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Phone Support</div>
                  <div className="text-green-100 text-sm">+91-9876543210</div>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Email Support</div>
                  <div className="text-green-100 text-sm">support@greenpantry.com</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Support Hours</div>
                  <div className="text-green-100 text-sm">24/7 Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Policy Updates</h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300">
              We may update this Refund Policy from time to time. Any changes will be posted on this page with an 
              updated revision date. We encourage you to review this policy periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefundPage
