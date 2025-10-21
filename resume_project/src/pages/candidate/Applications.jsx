import React from 'react'
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react'

export default function Applications() {
  const applications = [
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      company: 'TechCorp Inc.',
      appliedDate: '2024-01-15',
      status: 'shortlisted',
      statusText: 'Shortlisted',
      interviewDate: '2024-01-25',
      matchScore: 95
    },
    {
      id: 2,
      jobTitle: 'Frontend Engineer',
      company: 'StartupXYZ',
      appliedDate: '2024-01-10',
      status: 'interview',
      statusText: 'Interview Scheduled',
      interviewDate: '2024-01-20',
      matchScore: 88
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'Digital Solutions',
      appliedDate: '2024-01-05',
      status: 'applied',
      statusText: 'Applied',
      interviewDate: null,
      matchScore: 92
    },
    {
      id: 4,
      jobTitle: 'React Native Developer',
      company: 'MobileFirst',
      appliedDate: '2023-12-20',
      status: 'rejected',
      statusText: 'Not Selected',
      interviewDate: null,
      matchScore: 78
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'interview':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Eye className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800'
      case 'interview':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-gray-600">Total Applications</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'shortlisted' || app.status === 'interview').length}
          </div>
          <div className="text-gray-600">Active Applications</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'interview').length}
          </div>
          <div className="text-gray-600">Interviews</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="text-2xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="text-gray-600">Not Selected</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {applications.map(application => (
            <div key={application.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                  <p className="text-gray-600">{application.company}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Applied on</div>
                    <div className="font-medium text-gray-900">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2">{application.statusText}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Match Score: </span>
                    <span className={`font-bold ${
                      application.matchScore >= 90 ? 'text-green-600' :
                      application.matchScore >= 80 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {application.matchScore}%
                    </span>
                  </div>
                  
                  {application.interviewDate && (
                    <div>
                      <span className="font-medium">Interview: </span>
                      <span className="text-gray-900">
                        {new Date(application.interviewDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View Job
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start applying to jobs to see your applications here.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  )
}