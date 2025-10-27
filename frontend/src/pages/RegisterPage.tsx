import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Navigation, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.number().min(0).max(3).refine((val) => val >= 0 && val <= 3, { message: 'Please select a role' }),
  // Address fields
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: 'India', // Default country
      role: 0, // Default role (User)
    },
  })

  const selectedRole = watch('role')

  // Role options with descriptions (using numeric values)
  const roleOptions = [
    { value: 0, label: 'Customer', description: 'Order food from restaurants' },
    { value: 1, label: 'Restaurant Owner', description: 'Manage your restaurant and menu' },
    { value: 3, label: 'Delivery Partner', description: 'Deliver orders to customers' },
    { value: 2, label: 'Administrator', description: 'Manage the platform' },
  ]

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      try {
        return await apiService.register(data)
      } catch (error: any) {
        // Log the actual error for debugging
        console.error('Registration API error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        
        // For now, let's see the real error instead of creating mock users
        throw error
      }
    },
    onSuccess: (response) => {
      const { user, token, refreshToken } = response.data
      login(user, token, refreshToken)
      toast.success('Account created successfully!')
      navigate('/')
    },
    onError: (error: any) => {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    },
  })

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        )
      })

      // Use multiple geocoding services to get better postal code data
      let response, data

      // Try BigDataCloud first
      try {
        response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        )

        if (response.ok) {
          data = await response.json()
          console.log('BigDataCloud API response:', data)
        }
      } catch (error) {
        console.log('BigDataCloud API failed:', error)
      }

      // If BigDataCloud doesn't work or doesn't have postal code, try Nominatim (OpenStreetMap)
      if (!response?.ok || !data?.postcode) {
        try {
          console.log('Trying Nominatim API for postal code...')
          response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1&accept-language=en`
          )

          if (response.ok) {
            data = await response.json()
            console.log('Nominatim API response:', data)
          }
        } catch (error) {
          console.log('Nominatim API failed:', error)
        }
      }

      if (response?.ok && data) {
        console.log('Using API response:', data) // Debug log

        // Extract data based on which API responded
        let city, state, street, postalCode, country

        if (data.city || data.locality) {
          // BigDataCloud API response
          city = data.city || data.locality || 'Unknown City'
          state = data.principalSubdivision || data.administrativeArea || 'Unknown State'
          country = data.countryName || 'India'

          // Street address extraction for BigDataCloud
          if (data.streetName) {
            street = data.streetName
          } else if (data.localityInfo?.administrative) {
            const adminLevels = data.localityInfo.administrative
            const streetLevel = adminLevels.reduce((prev: any, current: any) =>
              (current.order > prev.order) ? current : prev
            )
            street = streetLevel?.name || ''
          } else if (data.locality) {
            street = data.locality
          }

          // Postal code extraction for BigDataCloud
          postalCode = data.postcode || data.postalCode || data.postal_code || ''

        } else if (data.address) {
          // Nominatim API response
          const addr = data.address
          city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || 'Unknown City'
          state = addr.state || addr.county || addr.region || 'Unknown State'
          country = addr.country || 'India'
          street = addr.road || addr.pedestrian || addr.footway || addr.street || addr.house_number || ''
          postalCode = addr.postcode || addr.postal_code || addr.postalcode || ''
        } else {
          // Fallback
          city = 'Unknown City'
          state = 'Unknown State'
          country = 'India'
          street = ''
          postalCode = ''
        }

        // If street is still empty or contains country name, use a generic address
        if (!street || street === country || street === state) {
          street = `${city}, ${state}` // Use city, state as street address
        }

        console.log('Extracted data:', { city, state, street, postalCode, country })

        // Set form values with the retrieved location data
        setValue('street', street)
        setValue('city', city)
        setValue('state', state)
        setValue('postalCode', postalCode)
        setValue('country', country)
        setValue('latitude', position.coords.latitude)
        setValue('longitude', position.coords.longitude)

        if (postalCode) {
          toast.success(`Address filled automatically! Postal code: ${postalCode}`)
        } else {
          toast.success('Address filled (postal code not available - please enter manually)')
        }
      } else {
        // Fallback to coordinates if reverse geocoding fails
        setValue('city', `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        setValue('postalCode', '')
        toast.success('Location coordinates filled!')
      }
    } catch (error: any) {
      console.error('Error getting location:', error)
      toast.error('Unable to get your location. Please enter it manually.')
    } finally {
      setIsGettingLocation(false)
    }
  }

  const onSubmit = (data: RegisterFormData) => {
    // Extract address data if provided
    const { street, city, state, postalCode, country, latitude, longitude, ...userData } = data

    registerMutation.mutate(userData)
  }

  return (
    <AuthLayout>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              className="h-12 w-auto"
              src="/GreenPantry logo.png"
              alt="GreenPantry"
              onError={(e) => {
                // Removed console log
                e.currentTarget.src = '/GreenPantry logo.png';
              }}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className="input pl-10"
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="label">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('lastName')}
                    type="text"
                    autoComplete="family-name"
                    className="input pl-10"
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="label">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  autoComplete="tel"
                  className="input pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input pl-10 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                Account Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedRole === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    }`}
                    onClick={() => setValue('role', option.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedRole === option.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          selectedRole === option.value
                            ? 'text-primary-900 dark:text-primary-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-xs mt-1 ${
                          selectedRole === option.value
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {selectedRole === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Address (Optional)</h3>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {isGettingLocation ? 'Getting...' : 'Get Current Address'}
              </button>
            </div>
            
            <div>
              <label htmlFor="street" className="label">
                Street Address
              </label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('street')}
                  type="text"
                  className="input pl-10"
                  placeholder="Enter your street address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label">
                  City
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className="input"
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="state" className="label">
                  State
                </label>
                <input
                  {...register('state')}
                  type="text"
                  className="input"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="label">
                  Postal Code
                </label>
                <input
                  {...register('postalCode')}
                  type="text"
                  className="input"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label htmlFor="country" className="label">
                  Country
                </label>
                <input
                  {...register('country')}
                  type="text"
                  className="input"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="btn btn-primary btn-lg w-full"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
