import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, Clock } from 'lucide-react'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Simply browse our restaurant partners, select your favorite dishes, add them to your cart, and proceed to checkout. You can pay using various methods including credit/debit cards, UPI, or cash on delivery."
    },
    {
      id: 2,
      question: "What are the delivery charges?",
      answer: "Delivery charges vary by restaurant and location, typically ranging from ₹20-₹80. You can see the exact delivery fee for each restaurant on their page. We also offer free delivery on orders above certain amounts."
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer: "Delivery times vary by restaurant and location, typically taking 20-45 minutes. You can see the estimated delivery time for each restaurant on their page. We'll also send you real-time updates about your order status."
    },
    {
      id: 4,
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order if the restaurant hasn't started preparing it yet. Once preparation begins, cancellation may not be possible. You can cancel through the order tracking page or by contacting our support team."
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, net banking, digital wallets like Paytm and PhonePe, and cash on delivery (where available)."
    },
    {
      id: 6,
      question: "How do I track my order?",
      answer: "You can track your order in real-time through the order tracking page. We'll send you SMS and email updates at each stage: order confirmed, restaurant preparing, out for delivery, and delivered."
    },
    {
      id: 7,
      question: "What if I have a complaint about my order?",
      answer: "We're sorry to hear about any issues with your order. Please contact our support team immediately with your order number and details. We'll work with the restaurant to resolve the issue and ensure your satisfaction."
    },
    {
      id: 8,
      question: "How do I become a restaurant partner?",
      answer: "We'd love to have you join our network! Please visit our restaurant partner page or contact our business development team. We'll guide you through the onboarding process and help you get started."
    }
  ]

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-max-width container-padding py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions and get the support you need
          </p>
        </div>
      </div>

      <div className="container-max-width container-padding py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and Quick Links */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Help</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="space-y-3">
                <a href="#contact" className="block text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Contact Support
                </a>
                <a href="#track-order" className="block text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Track Your Order
                </a>
                <a href="#refund" className="block text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Refund Policy
                </a>
                <a href="#terms" className="block text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Terms of Service
                </a>
                <a href="#privacy" className="block text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">+91-9876543210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">support@greenpantry.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No results found for your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
