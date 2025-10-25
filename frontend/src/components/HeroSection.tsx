import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Navigation } from 'lucide-react'

const HeroSection = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('Mumbai, Maharashtra')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build URL parameters
    const params = new URLSearchParams()
    
    // Add search term if provided
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    
    // Add location if provided
    if (location.trim()) {
      params.set('city', location.trim())
    }
    
    // Navigate to restaurants page with parameters
    const queryString = params.toString()
    navigate(`/restaurants${queryString ? `?${queryString}` : ''}`)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            const city = data.city || data.locality || 'Unknown City'
            const state = data.principalSubdivision || data.administrativeArea || 'Unknown State'
            setLocation(`${city}, ${state}`)
          } else {
            // Fallback to coordinates if reverse geocoding fails
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          }
        } catch (error) {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enter it manually.')
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your location. '
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied by user.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
            break
        }
        
        alert(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious Food
            <span className="block text-secondary-300">Delivered Fast</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Order from your favorite restaurants and enjoy fresh, hot meals delivered 
            right to your doorstep in minutes.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for restaurants or food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                />
              </div>
              <div className="sm:w-64 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                  placeholder="Enter your location"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Get current location"
                >
                  <Navigation className={`w-5 h-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-secondary btn-lg px-8 h-14"
                disabled={!searchQuery.trim() && !location.trim()}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-300 mb-2">1000+</div>
              <div className="text-primary-100">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-300 mb-2">50K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-300 mb-2">30min</div>
              <div className="text-primary-100">Average Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
