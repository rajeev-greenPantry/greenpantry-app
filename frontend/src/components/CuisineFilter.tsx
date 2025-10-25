import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const cuisines = [
  { name: 'Indian', icon: '🍛', color: 'bg-orange-100 text-orange-700' },
  { name: 'Chinese', icon: '🥢', color: 'bg-red-100 text-red-700' },
  { name: 'Italian', icon: '🍝', color: 'bg-green-100 text-green-700' },
  { name: 'Thai', icon: '🌶️', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Mexican', icon: '🌮', color: 'bg-orange-100 text-orange-700' },
  { name: 'Japanese', icon: '🍣', color: 'bg-blue-100 text-blue-700' },
  { name: 'Fast Food', icon: '🍔', color: 'bg-purple-100 text-purple-700' },
  { name: 'Desserts', icon: '🍰', color: 'bg-pink-100 text-pink-700' },
]

const CuisineFilter = () => {
  const navigate = useNavigate()
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)

  const handleCuisineClick = (cuisine: string) => {
    setSelectedCuisine(cuisine)
    navigate(`/restaurants?cuisine=${encodeURIComponent(cuisine)}`)
  }

  const handleViewAll = () => {
    setSelectedCuisine(null)
    navigate('/restaurants')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Cuisines</h2>
      <div className="flex flex-wrap gap-3">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine.name}
            onClick={() => handleCuisineClick(cuisine.name)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCuisine === cuisine.name
                ? `${cuisine.color} border-current shadow-md`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm'
            }`}
          >
            <span className="text-lg">{cuisine.icon}</span>
            <span className="font-medium">{cuisine.name}</span>
          </button>
        ))}
        <button
          onClick={handleViewAll}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-200"
        >
          <span className="font-medium">View All</span>
        </button>
      </div>
    </div>
  )
}

export default CuisineFilter
