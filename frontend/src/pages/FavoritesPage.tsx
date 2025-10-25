import { useState } from 'react'
import { Heart, Star, Clock, MapPin, Search, Filter, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const FavoritesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Restaurants', 'Dishes']

  const favoriteRestaurants = [
    {
      id: 'restaurant-1',
      name: 'Spice Garden',
      cuisine: 'Indian',
      rating: 4.5,
      deliveryTime: '30 min',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
      priceRange: '₹₹',
      address: '123 Linking Road, Bandra West',
      isOpen: true,
      deliveryFee: 50,
      addedDate: '2024-01-10'
    },
    {
      id: 'restaurant-2',
      name: 'Dragon Palace',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '25 min',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=300',
      priceRange: '₹₹',
      address: '456 Juhu Tara Road, Juhu',
      isOpen: true,
      deliveryFee: 40,
      addedDate: '2024-01-08'
    },
    {
      id: 'restaurant-3',
      name: 'Bella Vista',
      cuisine: 'Italian',
      rating: 4.7,
      deliveryTime: '35 min',
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300',
      priceRange: '₹₹₹',
      address: '789 Brigade Road, MG Road',
      isOpen: false,
      deliveryFee: 60,
      addedDate: '2024-01-05'
    }
  ]

  const favoriteDishes = [
    {
      id: 'dish-1',
      name: 'Chicken Biryani',
      restaurant: 'Spice Garden',
      price: 350,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d4?w=200',
      category: 'Main Course',
      addedDate: '2024-01-12'
    },
    {
      id: 'dish-2',
      name: 'Margherita Pizza',
      restaurant: 'Bella Vista',
      price: 450,
      image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200',
      category: 'Pizza',
      addedDate: '2024-01-11'
    },
    {
      id: 'dish-3',
      name: 'Pad Thai',
      restaurant: 'Thai Corner',
      price: 380,
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200',
      category: 'Noodles',
      addedDate: '2024-01-09'
    }
  ]

  const allFavorites = [
    ...favoriteRestaurants.map(item => ({ ...item, type: 'restaurant' })),
    ...favoriteDishes.map(item => ({ ...item, type: 'dish' }))
  ]

  const filteredFavorites = allFavorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.type === 'restaurant' && (item as any).cuisine?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.type === 'dish' && (item as any).restaurant?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || 
                           (selectedCategory === 'Restaurants' && item.type === 'restaurant') ||
                           (selectedCategory === 'Dishes' && item.type === 'dish')
    
    return matchesSearch && matchesCategory
  })

  const removeFavorite = (id: string, type: string) => {
    // In a real app, this would make an API call to remove the favorite
    console.log(`Removing ${type} with id: ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your favorite restaurants and dishes
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Favorites</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredFavorites.length}</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Sort
            </button>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Favorites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFavorite(item.id, item.type)}
                  className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
                {item.type === 'restaurant' && !(item as any).isOpen && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    Closed
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                
                {item.type === 'restaurant' ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {(item as any).cuisine} • {(item as any).priceRange}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {item.address}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.rating}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {item.deliveryTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {item.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Delivery Fee: ₹{item.deliveryFee}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (item as any).isOpen 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {(item as any).isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {item.restaurant} • {item.category}
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
                      ₹{item.price}
                    </p>
                  </>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Link
                    to={item.type === 'restaurant' ? `/restaurants/${item.id}` : `/restaurants`}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                  >
                    {item.type === 'restaurant' ? 'View Menu' : 'Order Now'}
                  </Link>
                  <button
                    onClick={() => removeFavorite(item.id, item.type)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Favorites */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No favorites found' : 'No favorites yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search or browse our restaurants to find something you love.'
                : 'Start adding restaurants and dishes to your favorites to see them here.'
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

        {/* Quick Actions */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/restaurants"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="bg-green-100 dark:bg-green-900 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-bold">+</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Add More Favorites</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Discover new restaurants</p>
              </div>
            </Link>
            
            <Link
              to="/offers"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="bg-yellow-100 dark:bg-yellow-900 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">%</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Check Offers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Save on your favorites</p>
              </div>
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Order History</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">View past orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage
