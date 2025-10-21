import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, Settings, Rocket, Star, Shield, Zap, Target, Globe } from 'lucide-react'

export default function Homepage() {
  const modules = [
    {
      title: "Job Seeker",
      role: "candidate",
      description: "Find your dream job with AI-powered matching and career guidance",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      features: [
        "AI Job Matching",
        "Resume Parsing",
        "Career Analytics",
        "Smart Applications"
      ],
      stats: "50K+ Jobs Available"
    },
    {
      title: "Recruiter",
      role: "recruiter",
      description: "Hire the best talent with intelligent screening and candidate management",
      icon: Briefcase,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      features: [
        "AI Resume Screening",
        "Candidate Ranking",
        "Interview Scheduling",
        "Analytics Dashboard"
      ],
      stats: "10K+ Companies Hiring"
    },
    {
      title: "Administrator",
      role: "admin",
      description: "Manage platform operations, users, and system analytics",
      icon: Settings,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      features: [
        "User Management",
        "Platform Analytics",
        "System Monitoring",
        "Content Moderation"
      ],
      stats: "100K+ Platform Users"
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Advanced algorithms that match candidates with perfect job opportunities"
    },
    {
      icon: Target,
      title: "Smart Screening",
      description: "Intelligent resume parsing and candidate ranking for recruiters"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security and data protection for all users"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with opportunities and talent from around the world"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Rocket className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Job Platform</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Find Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Intelligent job matching, resume parsing, and career opportunities powered by artificial intelligence
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
              
              <Link
                to="/login"
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-white/50 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select your role to access tailored features and tools designed for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <div
                  key={module.role}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} opacity-50`}></div>
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${module.gradient} shadow-lg mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {module.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {module.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <Star className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Stats */}
                    <div className="text-sm font-semibold text-gray-500 mb-6">
                      {module.stats}
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/register?role=${module.role}`}
                      className={`block w-full bg-gradient-to-r ${module.gradient} text-white text-center py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                    >
                      Get Started as {module.title}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Advanced features powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="inline-flex p-3 rounded-xl bg-white/10 mb-4 group-hover:bg-white/20 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies using our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Free Today
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}