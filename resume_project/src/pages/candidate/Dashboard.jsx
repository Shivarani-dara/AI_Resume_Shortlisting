import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, Bell, User, TrendingUp, Sparkles, MapPin, Briefcase } from 'lucide-react'

export default function CandidateDashboard() {
  const stats = [
    { name: 'Applications', value: '12', change: '+2', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { name: 'Profile Views', value: '45', change: '+12', icon: User, color: 'from-green-500 to-emerald-500' },
    { name: 'Jobs Matched', value: '8', change: '+3', icon: Search, color: 'from-purple-500 to-pink-500' },
    { name: 'AI Score', value: '92%', change: '+5%', icon: TrendingUp, color: 'from-orange-500 to-red-500' }
  ]

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      match: 95,
      skills: ['React', 'TypeScript', 'Node.js'],
      urgent: true
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      match: 88,
      skills: ['React', 'CSS', 'JavaScript'],
      urgent: false
    }
  ]

  const quickActions = [
    { title: 'Smart Job Search', desc: 'AI-powered matching', icon: Sparkles, link: '/candidate/jobs', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'Profile Builder', desc: 'Enhance your profile', icon: User, link: '/candidate/profile', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { title: 'Application Tracker', desc: 'Track all applications', icon: FileText, link: '/candidate/applications', color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back, John! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's your career progress today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.name} className="relative group">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl transform group-hover:scale-105 transition-all duration-300"></div>
                <div className="relative p-6 rounded-2xl border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {item.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h3>
                  <p className="text-gray-600 text-sm">{item.name}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200 transition-all duration-300 group hover:shadow-lg"
                    >
                      <div className={`p-3 rounded-lg ${action.color} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.desc}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
                <span className="text-sm text-blue-600 font-semibold">AI-Powered Matches</span>
              </div>
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-200 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                          {job.urgent && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-semibold">
                          {job.match}% Match
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="text-green-600 font-semibold">
                        {job.salary}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {job.skills.map(skill => (
                          <span key={skill} className="bg-white px-2 py-1 rounded-lg text-xs font-medium text-gray-700 border">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}