import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, Search, Menu, X, Sun, Moon, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import SidebarContent from './SidebarContent'
import Cart from './Cart'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { URLS } from '../config/urls'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      <header className="header-container">
        <div className="header-content-wrapper ml-[-1rem]">
          <div className="header-main-layout">
            {/* Left Side: Menu Button + Logo */}
            <div className="header-left-container">
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="header-sidebar-toggle-button relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <AnimatePresence mode="wait">
                  {isSidebarOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <Link to="/" className="header-logo-container">
                <img
                  src="/GreenPantry logo.png"
                  alt="GreenPantry Logo"
                  className="header-logo-image"
                  onError={(e) => {
                    console.log('Logo failed to load:', e);
                    e.currentTarget.src = '/GreenPantry logo.png';
                  }}
                />
                <span className="header-logo-text">GreenPantry</span>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="header-center-container">
              <form onSubmit={handleSearch} className="header-search-form">
                <div className="header-search-input-wrapper">
                  <Search className="header-search-icon" />
                  <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="header-search-input"
                  />
                </div>
              </form>
            </div>

            {/* Right Side: Stats + Back to Portal + Theme + Cart + Auth */}
            <div className="header-right-container">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="header-theme-toggle-button"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>


              {/* Cart */}
              <Cart />

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="header-user-menu-container">
                  <Link to="/profile" className="header-user-button">
                    <User className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="header-logout-button"
                    title="Logout"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="header-auth-buttons-container">
                  {/* Show Login button when on register page, hide when on login page */}
                  <Link
                    to="/login"
                    className={`btn-outline ${location.pathname === '/login' ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    Login
                  </Link>
                  {/* Show Sign Up button when on login page, hide when on register page */}
                  <Link
                    to="/register"
                    className={`btn-primary ${location.pathname === '/register' ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
                </div>
              {/* Hidden: Back to Portal Button */}
              {/* <div className="hidden md:flex items-center mr-[-31rem] ml-5">
                <Link
                  to={URLS.MAIN_PORTAL}
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                  title="Back to Rajeev's Pvt. Ltd. Portal"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden lg:inline">Back to Portal</span>
                </Link>
            </div> */}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="header-sidebar-container"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
            {/* Sidebar Header */}
            <div className="header-sidebar-header">
              <h2 className="header-sidebar-title">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="header-close-button"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              </button>
            </div>

            {/* Sidebar Content */}
            <SidebarContent onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header