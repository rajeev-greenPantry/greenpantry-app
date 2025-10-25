import { useState } from 'react'
import { MapPin, Plus, Edit, Trash2, Home, Building, Briefcase, Check } from 'lucide-react'

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Home',
      address: '123 MG Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      phone: '+91-9876543210',
      isDefault: true,
      instructions: 'Ring the doorbell twice'
    },
    {
      id: 2,
      type: 'Work',
      name: 'Office',
      address: '456 Business Park, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400069',
      phone: '+91-9876543211',
      isDefault: false,
      instructions: 'Call when you reach the gate'
    },
    {
      id: 3,
      type: 'Other',
      name: 'Friend\'s Place',
      address: '789 Residential Complex, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400076',
      phone: '+91-9876543212',
      isDefault: false,
      instructions: 'Leave at security desk'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return <Home className="w-5 h-5" />
      case 'Work':
        return <Briefcase className="w-5 h-5" />
      default:
        return <Building className="w-5 h-5" />
    }
  }

  const getAddressIconColor = (type: string) => {
    switch (type) {
      case 'Home':
        return 'text-blue-600 dark:text-blue-400'
      case 'Work':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const setDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const deleteAddress = (id: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter(addr => addr.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Saved Addresses</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage your delivery addresses for quick and easy ordering
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Address
            </button>
          </div>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        {/* Addresses List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`${getAddressIconColor(address.type)} mr-3`}>
                    {getAddressIcon(address.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {address.name}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium mt-1">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {address.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Phone: {address.phone}
                </p>
                {address.instructions && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Instructions: {address.instructions}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Set Default
                  </button>
                )}
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Use This Address
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Address Form Modal */}
        {(showAddForm || editingAddress) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Home, Office"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    <textarea
                      placeholder="Enter your street address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="PIN Code"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91-9876543210"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="Any special instructions for delivery"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="default"
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="default" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Set as default address
                    </label>
                  </div>
                </form>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingAddress(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Addresses */}
        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No addresses saved</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add your first address to start ordering food delivery
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Add Your First Address
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Accurate Address</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Make sure to include building name, floor, and apartment number for easier delivery.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delivery Instructions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add specific instructions like "Ring doorbell twice" or "Leave at security desk".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressesPage
