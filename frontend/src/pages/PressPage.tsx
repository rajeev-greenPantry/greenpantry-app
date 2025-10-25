import React, { useState } from 'react'
import { Calendar, ExternalLink, Download, Mail, Phone, MapPin } from 'lucide-react'

const PressPage = () => {
  const [selectedYear, setSelectedYear] = useState('All')

  const years = ['All', '2024', '2023', '2022']

  const pressReleases = [
    {
      id: 1,
      title: "GreenPantry Raises $10M Series A to Expand Food Delivery Network",
      date: "2024-03-15",
      year: "2024",
      summary: "Funding will be used to expand to 10 new cities and enhance technology platform",
      category: "Funding",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "GreenPantry Partners with 500+ Local Restaurants in Mumbai",
      date: "2024-02-28",
      year: "2024",
      summary: "New partnerships bring diverse cuisines and authentic flavors to customers",
      category: "Partnerships",
      readTime: "2 min read"
    },
    {
      id: 3,
      title: "GreenPantry Launches Sustainable Packaging Initiative",
      date: "2024-01-20",
      year: "2024",
      summary: "Commitment to eco-friendly packaging reduces environmental impact by 40%",
      category: "Sustainability",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "GreenPantry Expands to Bangalore with 200+ Restaurant Partners",
      date: "2023-12-10",
      year: "2023",
      summary: "Tech hub expansion brings food delivery innovation to Silicon Valley of India",
      category: "Expansion",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "GreenPantry Wins 'Best Food Delivery App' at Tech Awards 2023",
      date: "2023-11-15",
      year: "2023",
      summary: "Recognition for innovation in food delivery and customer experience",
      category: "Awards",
      readTime: "2 min read"
    },
    {
      id: 6,
      title: "GreenPantry Launches AI-Powered Recommendation Engine",
      date: "2023-10-05",
      year: "2023",
      summary: "Machine learning technology helps customers discover their perfect meal",
      category: "Technology",
      readTime: "5 min read"
    }
  ]

  const mediaCoverage = [
    {
      id: 1,
      title: "GreenPantry: The Food Delivery App That's Changing the Game",
      outlet: "TechCrunch India",
      date: "2024-03-20",
      url: "https://techcrunch.com/example",
      type: "Article"
    },
    {
      id: 2,
      title: "How GreenPantry is Supporting Local Restaurants",
      outlet: "Economic Times",
      date: "2024-02-15",
      url: "https://economictimes.com/example",
      type: "Article"
    },
    {
      id: 3,
      title: "GreenPantry CEO Interview: The Future of Food Delivery",
      outlet: "YourStory",
      date: "2024-01-30",
      url: "https://yourstory.com/example",
      type: "Interview"
    },
    {
      id: 4,
      title: "Sustainable Food Delivery: GreenPantry's Green Initiative",
      outlet: "Mint",
      date: "2023-12-20",
      url: "https://mint.com/example",
      type: "Article"
    },
    {
      id: 5,
      title: "GreenPantry Raises Series A: Startup Spotlight",
      outlet: "Inc42",
      date: "2023-11-25",
      url: "https://inc42.com/example",
      type: "Article"
    }
  ]

  const awards = [
    {
      id: 1,
      title: "Best Food Delivery App 2024",
      organization: "Tech Awards India",
      date: "2024-03-10",
      category: "Mobile App"
    },
    {
      id: 2,
      title: "Innovation in Food Tech",
      organization: "Startup India Awards",
      date: "2023-12-15",
      category: "Technology"
    },
    {
      id: 3,
      title: "Best Customer Experience",
      organization: "Customer Choice Awards",
      date: "2023-10-20",
      category: "Service"
    },
    {
      id: 4,
      title: "Sustainable Business Model",
      organization: "Green Business Awards",
      date: "2023-09-05",
      category: "Sustainability"
    }
  ]

  const filteredPressReleases = selectedYear === 'All' 
    ? pressReleases 
    : pressReleases.filter(release => release.year === selectedYear)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container-max-width container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Press & Media</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Stay updated with the latest news, press releases, and media coverage 
              about GreenPantry.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Press Contact</h2>
            <p className="text-gray-600 dark:text-gray-300">
              For media inquiries, press releases, and interview requests
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">press@greenpantry.com</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+91-9876543210</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Office</h3>
              <p className="text-gray-600 dark:text-gray-300">Mumbai, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Press Releases */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Press Releases</h2>
            <div className="flex gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPressReleases.map((release) => (
              <div key={release.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                        {release.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{release.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {release.summary}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(release.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Read More
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Coverage */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Media Coverage</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {mediaCoverage.map((article) => (
              <div key={article.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {article.type}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(article.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.outlet}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  Read Article
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Awards & Recognition</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award) => (
              <div key={award.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {award.organization}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(award.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </p>
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs mt-2">
                  {award.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Press Kit */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-max-width container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Press Kit</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Download our press kit for logos, images, and company information
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download Press Kit
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Request Media Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PressPage
