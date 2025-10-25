import { useState } from 'react'
import { Star, Clock, Truck, MapPin, ChefHat } from 'lucide-react'
import { Restaurant } from '../types'
import RestaurantMenu from './RestaurantMenu'

interface RestaurantCardProps {
  restaurant: Restaurant
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-300 group cursor-pointer" onClick={() => setShowMenu(true)}>
        <div className="relative">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
          <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.rating}</span>
          </div>
        </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {restaurant.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.city}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{restaurant.estimatedDeliveryTime} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Delivery: ₹{restaurant.deliveryFee}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {restaurant.reviewCount} reviews
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {restaurant.cuisineTypes.slice(0, 2).map((cuisine, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
            >
              {cuisine}
            </span>
          ))}
          {restaurant.cuisineTypes.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              +{restaurant.cuisineTypes.length - 2} more
            </span>
          )}
        </div>
        
        {/* Menu Button */}
        <div className="p-4 pt-0">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <ChefHat className="w-4 h-4" />
            <span>View Menu</span>
          </button>
        </div>
      </div>
      </div>
      
      <RestaurantMenu 
        restaurant={restaurant} 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)} 
      />
    </>
  )
}

export default RestaurantCard
