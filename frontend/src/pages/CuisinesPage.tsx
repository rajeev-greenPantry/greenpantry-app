import { useState } from 'react'
import { Search, Filter, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const CuisinesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  // const [selectedCuisine] = useState('All')

  const cuisines = [
    { id: 'indian', name: 'Indian', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', count: 45 },
    { id: 'chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400', count: 32 },
    { id: 'italian', name: 'Italian', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400', count: 28 },
    { id: 'thai', name: 'Thai', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400', count: 18 },
    { id: 'japanese', name: 'Japanese', image: 'https://images.unsplash.com/photo-1579584421775-5c4d86c6a034?w=400', count: 15 },
    { id: 'mexican', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', count: 12 },
    { id: 'american', name: 'American', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', count: 25 },
    { id: 'mediterranean', name: 'Mediterranean', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', count: 8 },
    { id: 'french', name: 'French', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400', count: 6 },
    { id: 'korean', name: 'Korean', image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=400', count: 9 }
  ]

  const popularRestaurants = [
    {
      id: 'restaurant-1',
      name: 'Spice Garden',
      cuisine: 'Indian',
      rating: 4.5,
      deliveryTime: '30 min',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
      priceRange: '₹₹'
    },
    {
      id: 'restaurant-2',
      name: 'Dragon Palace',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '25 min',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=300',
      priceRange: '₹₹'
    },
    {
      id: 'restaurant-3',
      name: 'Bella Vista',
      cuisine: 'Italian',
      rating: 4.7,
      deliveryTime: '35 min',
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300',
      priceRange: '₹₹₹'
    }
  ]

  const filteredCuisines = cuisines.filter(cuisine => 
    cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Cuisines</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Discover restaurants by your favorite cuisine type
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Cuisine Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Cuisines</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredCuisines.map((cuisine) => (
              <Link
                key={cuisine.id}
                to={`/restaurants?cuisine=${cuisine.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-200" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {cuisine.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {cuisine.count} restaurants
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Restaurants</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {popularRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {restaurant.priceRange}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {restaurant.cuisine} • {restaurant.deliveryTime}
                  </p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {restaurant.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can't Find Your Cuisine?</h2>
          <p className="text-green-100 mb-6">
            We're constantly adding new restaurants and cuisines. Let us know what you're looking for!
          </p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Request a Cuisine
          </button>
        </div>
      </div>
    </div>
  )
}

export default CuisinesPage
