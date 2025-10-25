import { Linkedin, Twitter, Mail, Users, Award, Heart } from 'lucide-react'

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate about revolutionizing food delivery and supporting local businesses. 10+ years in tech and food industry.",
      linkedin: "https://linkedin.com/in/rajesh-kumar",
      twitter: "https://twitter.com/rajesh_kumar"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Tech visionary leading our engineering team. Expert in scalable systems and mobile app development.",
      linkedin: "https://linkedin.com/in/priya-sharma",
      twitter: "https://twitter.com/priya_sharma"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Ensuring smooth operations and excellent customer experience. Logistics and supply chain expert.",
      linkedin: "https://linkedin.com/in/amit-patel",
      twitter: "https://twitter.com/amit_patel"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Creative marketer building brand awareness and customer engagement. Digital marketing specialist.",
      linkedin: "https://linkedin.com/in/sneha-reddy",
      twitter: "https://twitter.com/sneha_reddy"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Head of Business Development",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      bio: "Building partnerships with restaurants and expanding our network. Business strategy expert.",
      linkedin: "https://linkedin.com/in/vikram-singh",
      twitter: "https://twitter.com/vikram_singh"
    },
    {
      id: 6,
      name: "Anita Desai",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      bio: "Ensuring customer satisfaction and building lasting relationships. Customer experience champion.",
      linkedin: "https://linkedin.com/in/anita-desai",
      twitter: "https://twitter.com/anita_desai"
    }
  ]

  const stats = [
    { number: "50+", label: "Team Members" },
    { number: "5", label: "Years Experience" },
    { number: "15+", label: "Cities Served" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container-max-width container-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              The passionate people behind GreenPantry, working together to deliver 
              exceptional food experiences to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="py-16">
        <div className="container-max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the visionaries and leaders who are shaping the future of food delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@greenpantry.com`}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container-max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Culture</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We believe in creating an environment where everyone can thrive and make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We work together as one team, sharing knowledge and supporting each other 
                to achieve common goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive for excellence in everything we do, continuously improving and 
                setting new standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Passion</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're passionate about what we do and committed to making a positive 
                impact in our communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-max-width container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to be part of something amazing? We're always looking for talented 
            individuals who share our vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/careers"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="mailto:careers@greenpantry.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPage
