import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, Bell, User } from 'lucide-react'

export default function CandidateDashboard() {
  const stats = [
    { name: 'Applications Sent', value: 12, icon: FileText },
    { name: 'Profile Views', value: 45, icon: User },
    { name: 'Jobs Matched', value: 8, icon: Search },
    { name: 'Notifications', value: 3, icon: Bell }
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/candidate/jobs"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <Search className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Search Jobs</h3>
            <p className="mt-2 text-sm text-gray-500">
              Find your next career opportunity with AI-powered job matching
            </p>
          </div>
        </Link>

        <Link
          to="/candidate/profile"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <User className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Update Profile</h3>
            <p className="mt-2 text-sm text-gray-500">
              Keep your profile and resume updated for better job matches
            </p>
          </div>
        </Link>

        <Link
          to="/candidate/applications"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <FileText className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">View Applications</h3>
            <p className="mt-2 text-sm text-gray-500">
              Track your job applications and interview status
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}