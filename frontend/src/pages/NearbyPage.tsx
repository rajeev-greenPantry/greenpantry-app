import React, { useState, useEffect } from 'react'
import { MapPin, Clock, Star, Filter, Search, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'

const NearbyPage = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('distance')

  const nearbyRestaurants = [
    {
      id: 'restaurant-1',
      name: 'Spice Garden',
      cuisine: 'Indian',
      rating: 4.5,
      deliveryTime: '25 min',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
      priceRange: '₹₹',
      address: '123 Linking Road, Bandra West',
      isOpen: true,
      deliveryFee: 50
    },
    {
      id: 'restaurant-2',
      name: 'Dragon Palace',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '20 min',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=300',
      priceRange: '₹₹',
      address: '456 Juhu Tara Road, Juhu',
      isOpen: true,
      deliveryFee: 40
    },
    {
      id: 'restaurant-3',
      name: 'Burger Junction',
      cuisine: 'American',
      rating: 4.2,
      deliveryTime: '15 min',
      distance: '0.5 km',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300',
      priceRange: '₹₹',
      address: '555 Andheri West, Link Road',
      isOpen: true,
      deliveryFee: 35
    },
    {
      id: 'restaurant-4',
      name: 'Thai Corner',
      cuisine: 'Thai',
      rating: 4.4,
      deliveryTime: '30 min',
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300',
      priceRange: '₹₹₹',
      address: '321 Indiranagar, 100 Feet Road',
      isOpen: false,
      deliveryFee: 45
    },
    {
      id: 'restaurant-5',
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.4,
      deliveryTime: '22 min',
      distance: '1.8 km',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
      priceRange: '₹₹',
      address: '321 Powai, Hiranandani Gardens',
      isOpen: true,
      deliveryFee: 45
    }
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Mumbai coordinates
          setUserLocation({ lat: 19.0760, lng: 72.8777 })
        }
      )
    } else {
      // Default to Mumbai coordinates
      setUserLocation({ lat: 19.0760, lng: 72.8777 })
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const filteredRestaurants = nearbyRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance)
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'deliveryTime') {
      return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Restaurants Near You</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Mumbai, Maharashtra</span>
                <button
                  onClick={getCurrentLocation}
                  className="ml-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Found</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredRestaurants.length} restaurants</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants near you..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="deliveryTime">Sort by Delivery Time</option>
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Restaurant List */}
        <div className="space-y-6">
          {sortedRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {restaurant.cuisine} • {restaurant.priceRange}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {restaurant.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {restaurant.rating}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {restaurant.deliveryTime}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Delivery</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {restaurant.distance}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Delivery Fee: ₹{restaurant.deliveryFee}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!restaurant.isOpen}
                      >
                        {restaurant.isOpen ? 'View Menu' : 'Closed'}
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No restaurants found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or check back later for new restaurants in your area.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Favorite Restaurant?</h2>
          <p className="text-green-100 mb-6">
            We're constantly adding new restaurants to our network. Let us know what you'd like to see!
          </p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Request a Restaurant
          </button>
        </div>
      </div>
    </div>
  )
}

export default NearbyPage
