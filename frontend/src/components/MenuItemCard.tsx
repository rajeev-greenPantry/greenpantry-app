import { useState } from 'react'
import { MenuItem } from '../types'
import { useCartStore } from '../store/cartStore'
import { Plus, Minus, Star, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface MenuItemCardProps {
  menuItem: MenuItem
}

const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
  const { addItem, items, updateQuantity } = useCartStore()
  const [selectedVariant, setSelectedVariant] = useState(
    menuItem.variants.find(v => v.isDefault)?.name || menuItem.variants[0]?.name || 'Regular'
  )
  const [, setQuantity] = useState(0)

  const cartItem = items.find(
    item => item.menuItem.id === menuItem.id && item.variant === selectedVariant
  )

  const currentQuantity = cartItem?.quantity || 0
  const variantPriceModifier = menuItem.variants.find(v => v.name === selectedVariant)?.priceModifier || 0
  const finalPrice = menuItem.price + variantPriceModifier

  const handleAddToCart = () => {
    addItem(menuItem, 1, selectedVariant)
    setQuantity(1)
    toast.success('Added to cart!')
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      updateQuantity(menuItem.id, 0, selectedVariant)
      setQuantity(0)
    } else {
      updateQuantity(menuItem.id, newQuantity, selectedVariant)
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{menuItem.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500 ml-2">
              <Star className="w-4 h-4" />
              <span>4.5</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{menuItem.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{menuItem.preparationTime} min</span>
            </div>
            {menuItem.isVegetarian && (
              <span className="text-green-600">🟢 Veg</span>
            )}
            {menuItem.isSpicy && (
              <span className="text-red-600">🌶️ Spicy</span>
            )}
          </div>

          {/* Variants */}
          {menuItem.variants.length > 1 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {menuItem.variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant.name)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      selectedVariant === variant.name
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {variant.name}
                    {variant.priceModifier > 0 && ` (+₹${variant.priceModifier})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              ₹{finalPrice}
            </div>

            {currentQuantity > 0 ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{currentQuantity}</span>
                <button
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!menuItem.isAvailable}
                className="btn btn-primary btn-sm"
              >
                Add
              </button>
            )}
          </div>

          {!menuItem.isAvailable && (
            <div className="mt-2 text-sm text-red-600">Currently unavailable</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard
