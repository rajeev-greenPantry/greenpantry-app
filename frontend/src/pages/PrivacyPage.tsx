import React from 'react'
import { Shield, Eye, Lock, Database, User, Mail, Phone } from 'lucide-react'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
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
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Privacy Matters</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At GreenPantry, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              food delivery platform and services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery addresses and location data</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Account preferences and settings</li>
                  <li>Order history and favorite restaurants</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Device information and IP address</li>
                  <li>App usage patterns and interactions</li>
                  <li>Search queries and restaurant preferences</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Delivery</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support</li>
                  <li>Send order updates and confirmations</li>
                  <li>Enable restaurant recommendations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Improvement & Personalization</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Personalize your experience</li>
                  <li>Improve our services and app</li>
                  <li>Send relevant offers and promotions</li>
                  <li>Analyze usage patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure payment processing through certified providers</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Information Sharing</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Service Providers</h3>
                  <p>With trusted third-party service providers who assist us in operating our platform, such as payment processors, delivery partners, and analytics providers.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Legal Requirements</h3>
                  <p>When required by law or to protect our rights, property, or safety, or that of our users or the public.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Transfers</h3>
                  <p>In connection with any merger, sale of assets, or acquisition of our business.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Access & Control</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Access your personal information</li>
                  <li>Update or correct your data</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Portability</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Export your data in a readable format</li>
                  <li>Transfer your data to another service</li>
                  <li>Request data processing restrictions</li>
                  <li>Object to certain data processing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cookies and Tracking</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
                personalized content. You can control cookie settings through your browser preferences.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Types We Use:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Essential Cookies:</strong> Required for basic app functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our app</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-green-100 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>privacy@greenpantry.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                <span>Data Protection Officer</span>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Policy Updates</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
              Policy periodically for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
