import React from 'react'
import { FileText, AlertTriangle, Scale, Users, CreditCard, Shield } from 'lucide-react'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
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
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agreement to Terms</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to GreenPantry! These Terms of Service ("Terms") govern your use of our food delivery platform 
              and services. By accessing or using our services, you agree to be bound by these Terms. If you do not 
              agree to these Terms, please do not use our services.
            </p>
          </div>

          {/* Service Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                GreenPantry is a food delivery platform that connects customers with local restaurants. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Online food ordering and delivery services</li>
                <li>Restaurant discovery and menu browsing</li>
                <li>Payment processing and order management</li>
                <li>Customer support and order tracking</li>
                <li>Promotional offers and loyalty programs</li>
              </ul>
            </div>
          </div>

          {/* User Accounts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Accounts</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Account Creation</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>You must keep your contact information up to date</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Orders and Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders and Payments</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ordering Process</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>All orders are subject to restaurant availability and acceptance</li>
                  <li>Menu items, prices, and availability may change without notice</li>
                  <li>Delivery times are estimates and may vary based on various factors</li>
                  <li>We reserve the right to refuse or cancel orders at our discretion</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Payment is required at the time of order placement</li>
                  <li>We accept various payment methods including credit cards, debit cards, and digital wallets</li>
                  <li>All prices include applicable taxes unless otherwise stated</li>
                  <li>Refunds are processed according to our refund policy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delivery</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Delivery fees are calculated based on distance and restaurant policies</li>
                  <li>We are not responsible for delays caused by weather, traffic, or other external factors</li>
                  <li>You must be available to receive your order at the specified delivery address</li>
                  <li>We may require age verification for alcohol orders</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Conduct */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Conduct</h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>You agree not to use our services for any unlawful or prohibited activities, including but not limited to:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prohibited Activities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Transmitting harmful or malicious code</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Interfering with the proper functioning of our services</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Content Guidelines</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Posting false, misleading, or fraudulent information</li>
                    <li>Harassing, threatening, or abusing other users</li>
                    <li>Posting inappropriate or offensive content</li>
                    <li>Spamming or sending unsolicited communications</li>
                    <li>Impersonating others or misrepresenting your identity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Intellectual Property</h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                All content, features, and functionality of our services, including but not limited to text, graphics, 
                logos, images, and software, are owned by GreenPantry or its licensors and are protected by copyright, 
                trademark, and other intellectual property laws.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">License to Use</h3>
                <p className="text-sm">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our services for 
                  personal, non-commercial purposes in accordance with these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimers and Limitations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Disclaimers and Limitations</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Availability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our services are provided "as is" and "as available." We do not guarantee that our services will be 
                  uninterrupted, error-free, or free from viruses or other harmful components.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To the maximum extent permitted by law, GreenPantry shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including but not limited to loss of profits, data, or 
                  use, arising out of or relating to your use of our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our services may integrate with third-party services. We are not responsible for the content, privacy 
                  practices, or terms of service of these third-party services.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Termination</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Either party may terminate this agreement at any time. We may suspend or terminate your account 
                immediately, without prior notice, if you violate these Terms or engage in fraudulent or illegal activities.
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Effect of Termination</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Upon termination, your right to use our services will cease immediately. We may delete your account 
                  and data, and you will not be entitled to any refunds for unused services.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Governing Law</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to 
                its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive 
                jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-green-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-green-100 mb-6">
              We reserve the right to modify these Terms at any time. We will notify you of any material changes by 
              posting the new Terms on this page and updating the "Last updated" date. Your continued use of our 
              services after such modifications constitutes acceptance of the updated Terms.
            </p>
            
            <div className="bg-green-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-green-100 text-sm">
                If you have any questions about these Terms of Service, please contact us at legal@greenpantry.com 
                or call us at +91-9876543210.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
