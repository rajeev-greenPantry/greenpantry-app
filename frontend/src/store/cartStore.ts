import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, MenuItem } from '../types'

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
}

interface CartActions {
  addItem: (menuItem: MenuItem, quantity: number, variant?: string, specialInstructions?: string) => void
  removeItem: (menuItemId: string, variant?: string) => void
  updateQuantity: (menuItemId: string, quantity: number, variant?: string) => void
  clearCart: () => void
  setRestaurant: (restaurantId: string) => void
  calculateTotals: () => void
}

const calculateItemTotal = (price: number, quantity: number, variantPriceModifier: number = 0) => {
  return (price + variantPriceModifier) * quantity
}

const calculateTax = (subtotal: number) => {
  return subtotal * 0.18 // 18% GST
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      restaurantId: null,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,

      // Actions
      addItem: (menuItem, quantity, variant = 'Regular', specialInstructions = '') => {
        const state = get()
        
        // Check if adding from different restaurant
        if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
          // Clear cart and add new item
          set({
            items: [],
            restaurantId: menuItem.restaurantId,
            subtotal: 0,
            deliveryFee: 0,
            tax: 0,
            total: 0
          })
        }

        const existingItemIndex = state.items.findIndex(
          item => item.menuItem.id === menuItem.id && item.variant === variant
        )

        if (existingItemIndex > -1) {
          // Update existing item
          const updatedItems = [...state.items]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem: CartItem = {
            menuItem,
            quantity,
            variant,
            specialInstructions
          }
          set({ 
            items: [...state.items, newItem],
            restaurantId: menuItem.restaurantId
          })
        }

        get().calculateTotals()
      },

      removeItem: (menuItemId, variant = 'Regular') => {
        const state = get()
        const updatedItems = state.items.filter(
          item => !(item.menuItem.id === menuItemId && item.variant === variant)
        )
        set({ items: updatedItems })
        get().calculateTotals()
      },

      updateQuantity: (menuItemId, quantity, variant = 'Regular') => {
        if (quantity <= 0) {
          get().removeItem(menuItemId, variant)
          return
        }

        const state = get()
        const updatedItems = state.items.map(item => {
          if (item.menuItem.id === menuItemId && item.variant === variant) {
            return { ...item, quantity }
          }
          return item
        })
        set({ items: updatedItems })
        get().calculateTotals()
      },

      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          subtotal: 0,
          deliveryFee: 0,
          tax: 0,
          total: 0
        })
      },

      setRestaurant: (restaurantId) => {
        set({ restaurantId })
      },

      calculateTotals: () => {
        const state = get()
        const subtotal = state.items.reduce((sum, item) => {
          const variantPriceModifier = item.menuItem.variants.find(v => v.name === item.variant)?.priceModifier || 0
          return sum + calculateItemTotal(item.menuItem.price, item.quantity, variantPriceModifier)
        }, 0)

        const deliveryFee = state.items.length > 0 ? 50 : 0 // Fixed delivery fee
        const tax = calculateTax(subtotal)
        const total = subtotal + deliveryFee + tax

        set({
          subtotal,
          deliveryFee,
          tax,
          total
        })
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId
      })
    }
  )
)
