import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { MenuCategory } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import MenuItemCard from '../components/MenuItemCard'
import { Star, Clock, Truck, MapPin, Phone } from 'lucide-react'

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => apiService.getRestaurantById(id!),
    select: (response) => response.data,
    enabled: !!id
  })

  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ['restaurant-menu', id],
    queryFn: () => apiService.getRestaurantMenu(id!),
    select: (response) => response.data,
    enabled: !!id
  })

  if (restaurantLoading) {
    return <LoadingSpinner />
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="mb-8">
        <div className="relative">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}, {restaurant.city}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.estimatedDeliveryTime} min delivery</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4" />
              <span>₹{restaurant.deliveryFee} delivery fee</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phoneNumber}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {restaurant.cuisineTypes.map((cuisine, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        
        {menuLoading ? (
          <LoadingSpinner />
        ) : menu && menu.length > 0 ? (
          <div className="space-y-8">
            {menu.map((category: MenuCategory) => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <MenuItemCard key={item.id} menuItem={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu available</h3>
            <p className="text-gray-600">This restaurant hasn't added their menu yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetailPage
