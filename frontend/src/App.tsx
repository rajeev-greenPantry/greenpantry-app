import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import ThemeProvider from './components/ThemeProvider'
import { CartProvider } from './contexts/CartContext'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'
import TeamPage from './pages/TeamPage'
import CareersPage from './pages/CareersPage'
import PressPage from './pages/PressPage'
import CuisinesPage from './pages/CuisinesPage'
import OffersPage from './pages/OffersPage'
import NearbyPage from './pages/NearbyPage'
import OrdersPage from './pages/OrdersPage'
import FavoritesPage from './pages/FavoritesPage'
import AddressesPage from './pages/AddressesPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'
import RefundPage from './pages/RefundPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { initializeAuth } = useAuthStore()

  // Initialize auth state on app startup
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="app-main-container">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="about" element={<AboutPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="press" element={<PressPage />} />
            <Route path="cuisines" element={<CuisinesPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="nearby" element={<NearbyPage />} />
            <Route 
              path="orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="favorites" 
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="addresses" 
              element={
                <ProtectedRoute>
                  <AddressesPage />
                </ProtectedRoute>
              } 
            />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="cookies" element={<CookiesPage />} />
            <Route path="refund" element={<RefundPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
