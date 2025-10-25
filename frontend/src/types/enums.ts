// User Roles
export enum UserRole {
  User = 'User',
  Customer = 'Customer',
  Vendor = 'Vendor',
  Admin = 'Admin',
  Delivery = 'Delivery'
}

// Restaurant Status
export enum RestaurantStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Approved = 'Approved',
  Suspended = 'Suspended',
  Closed = 'Closed'
}

// Order Status
export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Preparing = 'Preparing',
  ReadyForPickup = 'ReadyForPickup',
  ReadyForDelivery = 'ReadyForDelivery',
  OutForDelivery = 'OutForDelivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

// Payment Method
export enum PaymentMethod {
  CashOnDelivery = 'CashOnDelivery',
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  UPI = 'UPI',
  NetBanking = 'NetBanking',
  Wallet = 'Wallet'
}

// Payment Status
export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

// Cuisine Type
export enum CuisineType {
  Indian = 'Indian',
  Chinese = 'Chinese',
  Italian = 'Italian',
  Mexican = 'Mexican',
  Thai = 'Thai',
  Japanese = 'Japanese',
  American = 'American',
  Mediterranean = 'Mediterranean',
  Korean = 'Korean',
  Vietnamese = 'Vietnamese',
  French = 'French',
  Lebanese = 'Lebanese',
  Turkish = 'Turkish',
  Spanish = 'Spanish',
  Greek = 'Greek',
  Other = 'Other'
}

// Order Status Display Names
export const OrderStatusDisplayNames: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Confirmed]: 'Confirmed',
  [OrderStatus.Preparing]: 'Preparing',
  [OrderStatus.ReadyForPickup]: 'Ready for Pickup',
  [OrderStatus.ReadyForDelivery]: 'Ready for Delivery',
  [OrderStatus.OutForDelivery]: 'Out for Delivery',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
  [OrderStatus.Refunded]: 'Refunded'
}

// Payment Method Display Names
export const PaymentMethodDisplayNames: Record<PaymentMethod, string> = {
  [PaymentMethod.CashOnDelivery]: 'Cash on Delivery',
  [PaymentMethod.CreditCard]: 'Credit Card',
  [PaymentMethod.DebitCard]: 'Debit Card',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.NetBanking]: 'Net Banking',
  [PaymentMethod.Wallet]: 'Wallet'
}

// Cuisine Type Display Names
export const CuisineTypeDisplayNames: Record<CuisineType, string> = {
  [CuisineType.Indian]: 'Indian',
  [CuisineType.Chinese]: 'Chinese',
  [CuisineType.Italian]: 'Italian',
  [CuisineType.Mexican]: 'Mexican',
  [CuisineType.Thai]: 'Thai',
  [CuisineType.Japanese]: 'Japanese',
  [CuisineType.American]: 'American',
  [CuisineType.Mediterranean]: 'Mediterranean',
  [CuisineType.Korean]: 'Korean',
  [CuisineType.Vietnamese]: 'Vietnamese',
  [CuisineType.French]: 'French',
  [CuisineType.Lebanese]: 'Lebanese',
  [CuisineType.Turkish]: 'Turkish',
  [CuisineType.Spanish]: 'Spanish',
  [CuisineType.Greek]: 'Greek',
  [CuisineType.Other]: 'Other'
}
