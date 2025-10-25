import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface SidebarContentProps {
  onClose: () => void
}

const SidebarContent = ({ onClose }: SidebarContentProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (menuName: string) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName)
  }

  return (
    <div className="sidebar-main-container">

      {/* Main Navigation */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('browse')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Browse</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'browse' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'browse' && (
          <ul className="sidebar-menu-container">
            <li>
              <Link 
                to="/restaurants" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                All Restaurants
              </Link>
            </li>
            <li>
              <Link 
                to="/cuisines" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Cuisines
              </Link>
            </li>
            <li>
              <Link 
                to="/offers" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Offers & Deals
              </Link>
            </li>
            <li>
              <Link 
                to="/nearby" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Near Me
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Account Section */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('account')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Account</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'account' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'account' && (
          <ul className="sidebar-menu-container">
            <li>
              <Link 
                to="/profile" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link 
                to="/orders" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Order History
              </Link>
            </li>
            <li>
              <Link 
                to="/favorites" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Favorites
              </Link>
            </li>
            <li>
              <Link 
                to="/addresses" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Saved Addresses
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Support Section */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('support')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Support</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'support' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'support' && (
          <ul className="sidebar-menu-container">
            <li>
              <Link 
                to="/help" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link 
                to="/faq" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Contact Support
              </Link>
            </li>
            <li>
              <Link 
                to="/feedback" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Send Feedback
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Company Section */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('company')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Company</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'company' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'company' && (
          <ul className="sidebar-menu-container">
            <li>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/team" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Our Team
              </Link>
            </li>
            <li>
              <Link 
                to="/careers" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Careers
              </Link>
            </li>
            <li>
              <Link 
                to="/press" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Press Kit
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Legal Section */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('legal')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Legal</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'legal' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'legal' && (
          <ul className="sidebar-menu-container">
            <li>
              <Link 
                to="/privacy" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                to="/cookies" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/refund" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Refund Policy
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Contact Information */}
      <div className="sidebar-section-container">
        <div 
          className="sidebar-section-header cursor-pointer"
          onClick={() => toggleSubmenu('contact')}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</h3>
          <ChevronRight 
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 ${
              activeSubmenu === 'contact' ? 'rotate-90' : ''
            }`} 
          />
        </div>
        
        {activeSubmenu === 'contact' && (
          <div className="sidebar-contact-info-container">
            <div className="sidebar-contact-item-container">
              <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-700 dark:text-gray-300">+91 70320 75893</span>
            </div>
            <div className="sidebar-contact-item-container">
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-gray-700 dark:text-gray-300">rajeevp727@greenpantry.com</span>
            </div>
            <div className="sidebar-contact-address-container">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
              <span className="text-gray-700 dark:text-gray-300">
                123 Business Park,<br />
                Mumbai, Maharashtra 400001
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="sidebar-social-section">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Follow Us</h4>
        <div className="sidebar-social-links-container">
          <a 
            href="#" 
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Facebook"
            onClick={onClose}
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Twitter"
            onClick={onClose}
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Instagram"
            onClick={onClose}
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default SidebarContent