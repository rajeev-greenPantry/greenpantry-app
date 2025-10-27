// URL Configuration for all applications
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7001';

export const URLS = {
  // Main Portal
  MAIN_PORTAL: 'http://localhost:3000',
  
  // GreenPantry
  GREENPANTRY_UI: import.meta.env.VITE_GREENPANTRY_UI || 'http://localhost:3001',
  GREENPANTRY_API: API_BASE_URL.replace('/api', '') || 'http://localhost:7001',
  
  // Restaurants
  RESTAURANTS_UI: 'http://localhost:3002',
  RESTAURANTS_API: 'http://localhost:5002',
  
  // Fitness
  FITNESS_UI: 'http://localhost:3003',
  FITNESS_API: 'http://localhost:5003',
  
  // Services
  SERVICES_UI: 'http://localhost:3004',
  SERVICES_API: 'http://localhost:5004',
} as const

// Helper function to get URL by key
export const getUrl = (key: keyof typeof URLS): string => URLS[key]

// Helper function to check if current URL matches any of our apps
export const isCurrentApp = (appUrl: string): boolean => {
  return window.location.origin === appUrl
}
