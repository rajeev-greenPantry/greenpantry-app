import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { Order, User, Address } from '../types'
import { UserRole } from '../types/enums'
import { User as UserIcon, MapPin, Package, Settings, Navigation } from 'lucide-react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  
  const { data: userProfile, refetch: refetchProfile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => apiService.getProfile(),
    select: (response) => response.data,
    enabled: isAuthenticated, // Only fetch from API if user is authenticated
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch when component mounts
    staleTime: 0, // Always consider data stale, so it refetches
  })

  // Handle profile fetch error
  useEffect(() => {
    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }
  }, [profileError])

  const { data: orders } = useQuery({
    queryKey: ['user-orders'],
    queryFn: () => apiService.getUserOrders(),
    select: (response) => response.data,
    enabled: isAuthenticated, // Only fetch from API if user is authenticated
  })

  // Use API data for authenticated users
  const profileData = userProfile as User | undefined
  const userOrders = orders || []

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      phoneNumber: profileData?.phoneNumber || '',
      street: profileData?.address?.street || '',
      city: profileData?.address?.city || '',
      state: profileData?.address?.state || '',
      postalCode: profileData?.address?.postalCode || '',
      country: profileData?.address?.country || '',
    },
  })

  // Refetch profile data when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchProfile()
    }
  }, [isAuthenticated, refetchProfile])

  // Update form values when profileData changes
  useEffect(() => {
    if (profileData) {
      setValue('firstName', profileData.firstName || '')
      setValue('lastName', profileData.lastName || '')
      setValue('phoneNumber', profileData.phoneNumber || '')
      setValue('street', profileData.address?.street || '')
      setValue('city', profileData.address?.city || '')
      setValue('state', profileData.address?.state || '')
      setValue('postalCode', profileData.address?.postalCode || '')
      setValue('country', profileData.address?.country || '')
    }
  }, [profileData, setValue])

  const updateProfileMutation = useMutation({
    mutationFn: (user: User) => apiService.updateProfile(user),
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      refetchProfile()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: (address: Address) => apiService.updateAddress(address),
    onSuccess: () => {
      toast.success('Address updated successfully!')
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      refetchProfile()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update address')
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    const { street, city, state, postalCode, country, ...profileData } = data
    
    // Update profile - create a proper User object
    const userUpdateData = {
      id: userProfile?.id || '',
      email: userProfile?.email || '',
      role: userProfile?.role || UserRole.User,
      isEmailVerified: userProfile?.isEmailVerified || false,
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      phoneNumber: profileData.phoneNumber || '',
    }
    updateProfileMutation.mutate(userUpdateData)
    
    // Update address if provided
    if (street && city && state && postalCode) {
      updateAddressMutation.mutate({
        street,
        city,
        state,
        postalCode,
        country: country || 'India',
        latitude: 19.0760, // Default Mumbai coordinates
        longitude: 72.8777,
      })
    }
  }

  const getCurrentLocation = async () => {
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

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'preparing':
        return 'text-blue-600 bg-blue-100'
      case 'outfordelivery':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Show loading state while fetching profile data
  if (isLoadingProfile) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  // Show error state if profile data is not available and user is authenticated
  if (isAuthenticated && !profileData && !isLoadingProfile) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Unable to load profile data. Please try again.</p>
          <button
            onClick={() => refetchProfile()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <a href="/login" className="btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                  activeTab === 'profile'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                  activeTab === 'orders'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                  activeTab === 'addresses'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Saved Addresses</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Profile Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input
                      {...register('firstName')}
                      className="input"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Last Name</label>
                    <input
                      {...register('lastName')}
                      className="input"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={profileData?.email || ''}
                    disabled
                    className="input bg-gray-50"
                  />
                  <p className="mt-1 text-sm text-red-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    {...register('phoneNumber')}
                    className="input"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Address
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isAuthenticated) {
                            refetchProfile()
                          }
                        }}
                        className="btn btn-outline btn-sm flex items-center space-x-2"
                        title="Refresh address data"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                      </button>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="btn btn-outline btn-sm flex items-center space-x-2"
                      >
                        <Navigation className={`w-4 h-4 ${isGettingLocation ? 'animate-spin' : ''}`} />
                        <span>{isGettingLocation ? 'Getting...' : 'Get Location'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Street Address</label>
                      <input
                        {...register('street')}
                        className="input"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">City</label>
                        <input
                          {...register('city')}
                          className="input"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="label">State</label>
                        <input
                          {...register('state')}
                          className="input"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Postal Code</label>
                        <input
                          {...register('postalCode')}
                          className="input"
                          placeholder="Postal code"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          If not auto-filled, please enter manually
                        </p>
                      </div>

                      <div>
                        <label className="label">Country</label>
                        <input
                          {...register('country')}
                          className="input"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending || updateAddressMutation.isPending}
                    className="btn btn-primary btn-md"
                  >
                    {updateProfileMutation.isPending || updateAddressMutation.isPending
                      ? 'Updating...'
                      : 'Update Profile'
                    }
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>

              {userOrders && userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders?.map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{order.total.toFixed(2)}
                          </span>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity} × {item.menuItemName}
                            </span>
                            <span>₹{item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Delivery Address:</span>
                          <span className="text-gray-600">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Addresses</h2>

              {profileData?.address ? (
                <div className="space-y-4">
                  {/* Primary Address */}
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <MapPin className="w-4 h-4 text-primary-600 mr-2" />
                          <h3 className="font-medium text-gray-900 dark:text-white">Primary Address</h3>
                          <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                            Default
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {profileData.address.street && (
                            <div className="font-medium">{profileData.address.street}</div>
                          )}
                          <div className="flex items-center">
                            <span>
                              {profileData.address.city && profileData.address.state && (
                                <span>{profileData.address.city}, {profileData.address.state}</span>
                              )}
                            </span>
                            {profileData.address.postalCode && (
                              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                                {profileData.address.postalCode}
                              </span>
                            )}
                          </div>
                          {profileData.address.country && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {profileData.address.country}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add New Address Button */}
                  <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Add New Address</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Save multiple addresses for faster checkout</p>
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No addresses saved</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first address to get started</p>
                  <button className="btn btn-primary">
                    Add Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
