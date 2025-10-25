import React, { useState } from 'react'
import { Clock, Star, MapPin } from 'lucide-react'

const OffersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Food', 'Delivery', 'First Order', 'Restaurant']

  const offers = [
    {
      id: 1,
      title: '50% OFF on First Order',
      description: 'Get 50% discount on your first order up to ₹200',
      code: 'WELCOME50',
      discount: '50%',
      type: 'First Order',
      validUntil: '2024-12-31',
      minOrder: 300,
      maxDiscount: 200,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      restaurant: 'All Restaurants',
      isActive: true
    },
    {
      id: 2,
      title: 'Free Delivery on Orders Above ₹500',
      description: 'No delivery charges on orders above ₹500',
      code: 'FREEDEL500',
      discount: 'Free Delivery',
      type: 'Delivery',
      validUntil: '2024-12-31',
      minOrder: 500,
      maxDiscount: 80,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400',
      restaurant: 'All Restaurants',
      isActive: true
    },
    {
      id: 3,
      title: '30% OFF at Spice Garden',
      description: 'Enjoy 30% discount on all orders at Spice Garden',
      code: 'SPICE30',
      discount: '30%',
      type: 'Restaurant',
      validUntil: '2024-11-30',
      minOrder: 200,
      maxDiscount: 150,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      restaurant: 'Spice Garden',
      isActive: true
    },
    {
      id: 4,
      title: 'Buy 1 Get 1 Free Pizza',
      description: 'Get one pizza free on every pizza purchase',
      code: 'BOGOPIZZA',
      discount: 'BOGO',
      type: 'Food',
      validUntil: '2024-10-31',
      minOrder: 400,
      maxDiscount: 300,
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
      restaurant: 'Bella Vista',
      isActive: true
    },
    {
      id: 5,
      title: '20% OFF on Chinese Food',
      description: 'Special discount on all Chinese cuisine orders',
      code: 'CHINESE20',
      discount: '20%',
      type: 'Food',
      validUntil: '2024-12-15',
      minOrder: 250,
      maxDiscount: 100,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400',
      restaurant: 'Dragon Palace',
      isActive: true
    },
    {
      id: 6,
      title: 'Free Dessert with Main Course',
      description: 'Get a free dessert with any main course order',
      code: 'FREEDESSERT',
      discount: 'Free Item',
      type: 'Food',
      validUntil: '2024-11-20',
      minOrder: 350,
      maxDiscount: 80,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
      restaurant: 'Thai Corner',
      isActive: true
    }
  ]

  const filteredOffers = selectedCategory === 'All' 
    ? offers 
    : offers.filter(offer => offer.type === selectedCategory)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container-max-width container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Offers & Deals</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Save big on your favorite meals with our exclusive offers and deals
            </p>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {offer.discount}
                </div>
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {offer.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Code:</span>
                    <span className="font-mono text-sm font-bold text-green-600 dark:text-green-400">
                      {offer.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Restaurant:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{offer.restaurant}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Min Order:</span>
                    <span className="text-sm text-gray-900 dark:text-white">₹{offer.minOrder}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Valid Until:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(offer.validUntil)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Use Offer
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use Offers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Use Offers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Your Offer</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Browse through our available offers and select the one you want to use
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Add Items to Cart</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Add items from the participating restaurant to your cart
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apply Code at Checkout</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Enter the offer code at checkout to get your discount
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Terms & Conditions</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Offers are valid for a limited time only</li>
            <li>• Each offer can only be used once per user</li>
            <li>• Offers cannot be combined with other promotions</li>
            <li>• Minimum order value must be met to avail the offer</li>
            <li>• GreenPantry reserves the right to modify or cancel offers at any time</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OffersPage
