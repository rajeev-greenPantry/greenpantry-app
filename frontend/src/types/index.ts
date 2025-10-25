import { UserRole, PaymentStatus } from './enums'

export { UserRole, PaymentStatus }

// User Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: UserRole
  isEmailVerified: boolean
  address?: Address
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number
  longitude: number
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  role: number
  address?: Address
}

export interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
  user: User
}

// Restaurant Types
export interface Restaurant {
  id: string
  name: string
  description: string
  imageUrl: string
  city: string
  state: string
  address: string
  phoneNumber: string
  cuisineTypes: string[]
  rating: number
  reviewCount: number
  deliveryFee: number
  estimatedDeliveryTime: number
  isActive: boolean
  imageUrls: string[]
  status: string
}

export interface RestaurantDetail extends Restaurant {
  email: string
  latitude: number
  longitude: number
  postalCode: string
  ownerId: string
}

export interface RestaurantFilter {
  city?: string
  cuisineType?: string
  minRating?: number
  maxDistance?: number
  userLatitude?: number
  userLongitude?: number
  searchTerm?: string
  page?: number
  pageSize?: number
}

// Menu Types
export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isSpicy: boolean
  spiceLevel: number
  allergens: string[]
  ingredients: string[]
  preparationTime: number
  isAvailable: boolean
  stockQuantity: number
  variants: MenuItemVariant[]
  tags: string[]
}

export interface MenuItemVariant {
  name: string
  priceModifier: number
  isDefault: boolean
}

export interface MenuCategory {
  category: string
  items: MenuItem[]
}

// Order Types
export interface Order {
  id: string
  userId: string
  restaurantId: string
  orderNumber: string
  status: string
  items: OrderItem[]
  subTotal: number
  deliveryFee: number
  tax: number
  total: number
  deliveryAddress: Address
  paymentMethod: string
  paymentId: string
  estimatedDeliveryTime?: string
  deliveredAt?: string
  deliveryInstructions: string
  deliveryPersonId: string
  statusHistory: OrderStatusHistory[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  menuItemId: string
  menuItemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variant: string
  specialInstructions: string
}

export interface OrderStatusHistory {
  status: string
  timestamp: string
  notes: string
  updatedBy: string
}

export interface CreateOrderRequest {
  restaurantId: string
  items: CreateOrderItemRequest[]
  deliveryAddress: Address
  paymentMethod: string
  deliveryInstructions: string
}

export interface CreateOrderItemRequest {
  menuItemId: string
  quantity: number
  variant: string
  specialInstructions: string
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem
  quantity: number
  variant: string
  specialInstructions: string
}

export interface Cart {
  items: CartItem[]
  restaurantId?: string
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Geolocation Types
export interface GeolocationResponse {
  latitude: number
  longitude: number
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  countryCode: string
  formattedAddress: string
}

// Payment Types
export enum PaymentProvider {
  Razorpay = 'Razorpay',
  Paytm = 'Paytm',
  PhonePe = 'PhonePe'
}


export interface PaymentRequest {
  orderId: string
  orderNumber: string
  amount: number
  currency: string
  provider: PaymentProvider
  customerName: string
  customerEmail: string
  customerPhone: string
  description: string
  metadata?: Record<string, any>
}

export interface UPIQRRequest {
  orderId: string
  amount: number
  currency: string
  provider: PaymentProvider
  customerName: string
  customerPhone: string
  description: string
  expiryMinutes?: number
}

export interface PaymentResponse {
  paymentId: string
  orderId: string
  provider: PaymentProvider
  status: PaymentStatus
  amount: number
  currency: string
  providerTransactionId: string
  upiQRCode?: string
  upiQRData?: string
  qrExpiresAt?: string
  paymentUrl?: string
  providerMetadata?: Record<string, any>
  refundId?: string
  refundAmount?: number
}

export interface RefundRequest {
  paymentId: string
  amount: number
  reason: string
  provider: PaymentProvider
}

export interface PaymentConfiguration {
  provider: PaymentProvider
  isEnabled: boolean
  isTestMode: boolean
  apiKey: string
  apiSecret: string
  webhookSecret: string
  baseUrl: string
  testBaseUrl: string
  qrExpiryMinutes: number
  minAmount: number
  maxAmount: number
  supportedCurrencies: string[]
  additionalSettings?: Record<string, any>
}
