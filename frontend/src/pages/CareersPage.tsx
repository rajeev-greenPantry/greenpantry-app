import { useState } from 'react'
import { MapPin, Clock, Users, ArrowRight, Filter, Search } from 'lucide-react'

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const departments = ['All', 'Engineering', 'Marketing', 'Operations', 'Sales', 'Customer Success', 'HR', 'Finance']
  const locations = ['All', 'Mumbai', 'Bangalore', 'Delhi', 'Remote']

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Mumbai",
      type: "Full-time",
      experience: "3-5 years",
      description: "We're looking for a passionate frontend developer to join our engineering team and help build amazing user experiences.",
      requirements: [
        "Strong experience with React, TypeScript, and modern frontend frameworks",
        "Experience with state management libraries (Redux, Zustand)",
        "Knowledge of responsive design and mobile-first development",
        "Experience with testing frameworks (Jest, React Testing Library)",
        "Strong problem-solving and communication skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "4-6 years",
      description: "Join our product team to drive the vision and strategy for our food delivery platform.",
      requirements: [
        "4+ years of product management experience",
        "Experience in B2C mobile applications",
        "Strong analytical and data-driven decision making",
        "Experience with agile development methodologies",
        "Excellent communication and stakeholder management skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Mumbai",
      type: "Full-time",
      experience: "3-5 years",
      description: "Lead our marketing efforts to grow our user base and brand awareness in the food delivery space.",
      requirements: [
        "3+ years of digital marketing experience",
        "Experience with social media marketing and content creation",
        "Knowledge of SEO, SEM, and email marketing",
        "Experience with marketing analytics and reporting",
        "Creative thinking and strong communication skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    },
    {
      id: 4,
      title: "Operations Manager",
      department: "Operations",
      location: "Delhi",
      type: "Full-time",
      experience: "2-4 years",
      description: "Help optimize our delivery operations and ensure smooth service across all our markets.",
      requirements: [
        "2+ years of operations or logistics experience",
        "Strong analytical and problem-solving skills",
        "Experience with process improvement and optimization",
        "Knowledge of supply chain and logistics",
        "Excellent communication and team management skills"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    },
    {
      id: 5,
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description: "Help our customers have the best possible experience with our platform and services.",
      requirements: [
        "1+ years of customer service or support experience",
        "Excellent communication and interpersonal skills",
        "Experience with CRM systems and support tools",
        "Problem-solving and conflict resolution skills",
        "Passion for helping customers succeed"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    },
    {
      id: 6,
      title: "Business Development Manager",
      department: "Sales",
      location: "Mumbai",
      type: "Full-time",
      experience: "3-5 years",
      description: "Build and maintain relationships with restaurant partners to expand our network.",
      requirements: [
        "3+ years of business development or sales experience",
        "Experience in the food and beverage industry preferred",
        "Strong networking and relationship building skills",
        "Experience with CRM and sales tools",
        "Results-driven and target-oriented mindset"
      ],
      benefits: [
        "Competitive salary and equity",
        "Health insurance and wellness programs",
        "Flexible work hours and remote work options",
        "Learning and development budget",
        "Team outings and company events"
      ]
    }
  ]

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesLocation && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container-max-width container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Be part of a mission-driven team that's revolutionizing food delivery 
              and supporting local communities.
            </p>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Work With Us?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We offer more than just a job - we offer a chance to make a real impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Great Team</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work with talented, passionate people who are committed to excellence 
                and continuous learning.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Work-Life Balance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Flexible work hours, remote work options, and generous time off to 
                help you maintain a healthy work-life balance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Growth Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuous learning opportunities, mentorship programs, and clear 
                career progression paths.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Openings */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find the perfect role for you and join our growing team
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Jobs
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search positions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedDepartment('All')
                    setSelectedLocation('All')
                  }}
                  className="w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria or check back later for new openings.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                        {job.department}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-gray-500">+{job.requirements.length - 3} more requirements</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {job.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {benefit}
                          </li>
                        ))}
                        {job.benefits.length > 3 && (
                          <li className="text-gray-500">+{job.benefits.length - 3} more benefits</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:careers@greenpantry.com?subject=Application for ${job.title}`}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      Apply Now
                    </a>
                    <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-max-width container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Perfect Role?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and 
            we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@greenpantry.com"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Send Your Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default CareersPage
