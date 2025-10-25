import { Users, Target, Award, Heart } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container-max-width container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About GreenPantry</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting you with the best local restaurants and delivering fresh, delicious meals right to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At GreenPantry, we believe that great food should be accessible to everyone, everywhere. 
                We're on a mission to revolutionize food delivery by connecting customers with the best 
                local restaurants while supporting sustainable practices and community growth.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                From farm-fresh ingredients to authentic flavors, we ensure every meal delivered 
                meets our high standards of quality, taste, and sustainability.
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-8 rounded-lg">
              <Target className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Quality First
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Every restaurant partner is carefully vetted to ensure they meet our standards 
                for food quality, hygiene, and customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core values guide everything we do at GreenPantry
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Customer First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your satisfaction is our priority. We listen, learn, and continuously improve 
                to provide the best possible experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for excellence in everything we do, from food quality to delivery 
                service and customer support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support local businesses and communities, fostering growth and 
                sustainability in the food industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-max-width container-padding">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Partner Restaurants</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-green-100">Delivery Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              GreenPantry was founded in 2024 with a simple vision: to make great food accessible 
              to everyone while supporting local restaurants and sustainable practices. What started 
              as a small team's passion project has grown into a platform that connects thousands 
              of customers with their favorite local eateries.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Today, we're proud to serve communities across India, delivering not just meals, 
              but experiences that bring people together through the universal language of food.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
