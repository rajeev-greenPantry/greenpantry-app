import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { Restaurant } from '../types'
import RestaurantCard from '../components/RestaurantCard'
import HeroSection from '../components/HeroSection'
import CuisineFilter from '../components/CuisineFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import { CartTest } from '../components/CartTest'

const HomePage = () => {
  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants', 'featured'],
    queryFn: () => apiService.getRestaurants({ pageSize: 8 }),
    select: (response) => response.data
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300">Unable to load restaurants. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Cart Integration Test - Remove this in production */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🧪 Cart & Payment Integration Test</h3>
          <p className="text-yellow-700 text-sm mb-4">
            Test the dynamic cart amount binding with payment integration. Add items to cart and test checkout flow.
          </p>
          <CartTest />
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CuisineFilter />
      </div>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Restaurants</h2>
          <a
            href="/restaurants"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            View All →
          </a>
        </div>

        {restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant: Restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No restaurants found</h3>
            <p className="text-gray-600 dark:text-gray-300">Check back later for new restaurants in your area.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose GreenPantry?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We make food delivery simple, fast, and reliable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your food delivered in 30 minutes or less with our efficient delivery network.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fresh Food</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Partner with top-rated restaurants to ensure you get the freshest, highest quality food.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Payment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pay securely with multiple payment options including UPI, cards, and cash on delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
