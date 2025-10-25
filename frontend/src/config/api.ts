import { URLS } from './urls'

export const API_BASE_URL = `${URLS.GREENPANTRY_API}/api`

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  // Users
  USERS: {
    PROFILE: '/users/profile',
    ADDRESS: '/users/address',
    ORDERS: '/users/orders',
  },
  // Restaurants
  RESTAURANTS: {
    LIST: '/restaurants',
    DETAIL: (id: string) => `/restaurants/${id}`,
    MENU: (id: string) => `/restaurants/${id}/menu`,
  },
  // Menu
  MENU: {
    ITEM: (id: string) => `/menu/${id}`,
    RESTAURANT: (id: string) => `/menu/restaurant/${id}`,
  },
  // Orders
  ORDERS: {
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    USER: (userId: string) => `/orders/user/${userId}`,
    RESTAURANT: (restaurantId: string) => `/orders/restaurant/${restaurantId}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
} as const
