import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { Restaurant, RestaurantFilter } from '../types'
import RestaurantCard from '../components/RestaurantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, Filter, X } from 'lucide-react'

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<RestaurantFilter>({
    searchTerm: searchParams.get('search') || '',
    city: searchParams.get('city') || 'Mumbai',
    cuisineType: searchParams.get('cuisine') || undefined,
    minRating: undefined,
    page: 1,
    pageSize: 20,
  })

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => apiService.getRestaurants(filters),
    select: (response) => response.data
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, searchTerm: filters.searchTerm, page: 1 }))
    updateUrlParams()
  }

  const handleFilterChange = (key: keyof RestaurantFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      city: 'Mumbai',
      cuisineType: undefined,
      minRating: undefined,
      page: 1,
      pageSize: 20,
    })
    setSearchParams({})
  }

  const updateUrlParams = () => {
    const params = new URLSearchParams()
    if (filters.searchTerm) params.set('search', filters.searchTerm)
    if (filters.city) params.set('city', filters.city)
    if (filters.cuisineType) params.set('cuisine', filters.cuisineType)
    if (filters.minRating) params.set('rating', filters.minRating.toString())
    setSearchParams(params)
  }

  useEffect(() => {
    updateUrlParams()
  }, [filters])

  const cuisineTypes = [
    'Indian', 'Chinese', 'Italian', 'Thai', 'Mexican', 
    'Japanese', 'Fast Food', 'Desserts', 'Continental'
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for restaurants or food..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-md flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="label">Cuisine Type</label>
                <select
                  value={filters.cuisineType || ''}
                  onChange={(e) => handleFilterChange('cuisineType', e.target.value || undefined)}
                  className="input"
                >
                  <option value="">All Cuisines</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Minimum Rating</label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                  className="input"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-primary btn-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {error ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Unable to load restaurants. Please try again later.</p>
        </div>
      ) : restaurants && restaurants.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              {filters.searchTerm && ` for "${filters.searchTerm}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant: Restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            {filters.searchTerm 
              ? `No restaurants found for "${filters.searchTerm}". Try a different search term.`
              : 'No restaurants available in this area. Check back later!'
            }
          </p>
          {filters.searchTerm && (
            <button
              onClick={clearFilters}
              className="btn btn-primary btn-md"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default RestaurantsPage
