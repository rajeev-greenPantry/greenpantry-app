import { useState } from 'react'
import { X, ChefHat } from 'lucide-react'
import MenuItem from './MenuItem'
import { Restaurant } from '../types'

interface RestaurantMenuProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}

const RestaurantMenu = ({ restaurant, isOpen, onClose }: RestaurantMenuProps) => {
  // Sample menu data - in a real app, this would come from an API
  const sampleMenuItems = [
    {
      id: `${restaurant.id}-pho-bo`,
      name: 'Pho Bo',
      description: 'Traditional Vietnamese beef noodle soup with fresh herbs',
      price: 299,
      category: 'Soup',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: `${restaurant.id}-pho-ga`,
      name: 'Pho Ga',
      description: 'Vietnamese chicken noodle soup with rice noodles',
      price: 279,
      category: 'Soup',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: `${restaurant.id}-banh-mi`,
      name: 'Banh Mi',
      description: 'Vietnamese sandwich with pickled vegetables and herbs',
      price: 199,
      category: 'Sandwich',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: `${restaurant.id}-spring-rolls`,
      name: 'Spring Rolls',
      description: 'Fresh Vietnamese spring rolls with shrimp and herbs',
      price: 149,
      category: 'Appetizer',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: `${restaurant.id}-bulgogi`,
      name: 'Bulgogi',
      description: 'Korean marinated beef with vegetables',
      price: 399,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: `${restaurant.id}-bibimbap`,
      name: 'Bibimbap',
      description: 'Korean mixed rice bowl with vegetables and egg',
      price: 349,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {restaurant.name} Menu
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {restaurant.city}, {restaurant.state}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleMenuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantMenu
