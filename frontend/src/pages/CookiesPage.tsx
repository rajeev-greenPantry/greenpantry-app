import { useState } from 'react'
import { Cookie, Settings, Shield, Eye, Database, ToggleLeft, ToggleRight } from 'lucide-react'

const CookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    functional: false,
    marketing: false
  })

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      required: true,
      examples: ['Authentication', 'Security', 'Load balancing', 'User interface customization']
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      required: false,
      examples: ['Google Analytics', 'Page views', 'User behavior', 'Performance metrics']
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization, such as videos and live chats.',
      required: false,
      examples: ['Language preferences', 'Region settings', 'Chat widgets', 'Video players']
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
      required: false,
      examples: ['Ad targeting', 'Social media integration', 'Remarketing', 'Interest-based advertising']
    }
  ]

  const handleToggle = (cookieType: string) => {
    if (cookieType === 'essential') return // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof prev]
    }))
  }

  const savePreferences = () => {
    // In a real app, this would save preferences to localStorage or send to server
    console.log('Cookie preferences saved:', cookiePreferences)
    alert('Your cookie preferences have been saved!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: January 15, 2024
          </p>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Cookie className="w-8 h-8 text-orange-600 dark:text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Are Cookies?</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and enabling various 
              website functions.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This Cookie Policy explains how GreenPantry uses cookies and similar technologies when you visit our 
              website or use our mobile application.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Cookies</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Website Functionality</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Remember your login status</li>
                  <li>Store your shopping cart contents</li>
                  <li>Remember your language preferences</li>
                  <li>Enable secure payment processing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personalization</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Show relevant restaurant recommendations</li>
                  <li>Remember your favorite cuisines</li>
                  <li>Customize your user experience</li>
                  <li>Provide location-based services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {cookieTypes.map((cookieType) => (
                <div key={cookieType.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {cookieType.name}
                        {cookieType.required && (
                          <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {cookieType.description}
                      </p>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Examples:</h4>
                        <div className="flex flex-wrap gap-2">
                          {cookieType.examples.map((example, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {cookieType.required ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Shield className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Always Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggle(cookieType.id)}
                          className="flex items-center"
                        >
                          {cookiePreferences[cookieType.id as keyof typeof cookiePreferences] ? (
                            <ToggleRight className="w-8 h-8 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Third-Party Cookies</h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We may also use third-party cookies from trusted partners to enhance your experience and provide 
                additional functionality. These partners include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics Partners</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Google Analytics - Website traffic analysis</li>
                    <li>Hotjar - User behavior insights</li>
                    <li>Mixpanel - Event tracking</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Providers</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Payment processors - Secure transactions</li>
                    <li>Maps services - Location features</li>
                    <li>Social media - Sharing functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Settings className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Managing Your Cookie Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Browser Settings</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You can control and delete cookies through your browser settings. However, please note that disabling 
                  certain cookies may affect the functionality of our website.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Safari</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Edge</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Our Cookie Settings</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You can also manage your cookie preferences using our settings panel below:
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">Cookie Preferences</h4>
                    <button
                      onClick={savePreferences}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {cookieTypes.map((cookieType) => (
                      <div key={cookieType.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{cookieType.name}</span>
                          {cookieType.required && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Required)</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {cookieType.required ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Always Active</span>
                          ) : (
                            <button
                              onClick={() => handleToggle(cookieType.id)}
                              className="flex items-center"
                            >
                              {cookiePreferences[cookieType.id as keyof typeof cookiePreferences] ? (
                                <ToggleRight className="w-6 h-6 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-orange-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
            <p className="text-orange-100 mb-6">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-orange-100">privacy@greenpantry.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-orange-100">+91-9876543210</p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Policy Updates</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
              updated policy on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiesPage
