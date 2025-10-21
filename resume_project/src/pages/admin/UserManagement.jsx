import React, { useState } from 'react'
import { Search, Filter, MoreVertical, Mail, Phone, User, Briefcase } from 'lucide-react'

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'candidate',
      status: 'active',
      registrationDate: '2024-01-01',
      lastLogin: '2024-01-15',
      jobsApplied: 12,
      profileComplete: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      role: 'recruiter',
      status: 'active',
      registrationDate: '2024-01-02',
      lastLogin: '2024-01-14',
      company: 'TechCorp Inc.',
      jobsPosted: 5
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 456-7890',
      role: 'candidate',
      status: 'inactive',
      registrationDate: '2024-01-03',
      lastLogin: '2024-01-10',
      jobsApplied: 3,
      profileComplete: false
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 321-0987',
      role: 'recruiter',
      status: 'active',
      registrationDate: '2024-01-04',
      lastLogin: '2024-01-15',
      company: 'StartupXYZ',
      jobsPosted: 8
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role) => {
    return role === 'candidate' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
            <button className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Users ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredUsers.map(user => (
            <div key={user.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.phone}
                      </div>
                      <div>
                        Registered: {new Date(user.registrationDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Role-specific information */}
                    {user.role === 'candidate' && (
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Jobs Applied:</span> {user.jobsApplied}
                        </div>
                        <div>
                          <span className="font-medium">Profile:</span> 
                          <span className={user.profileComplete ? 'text-green-600 ml-1' : 'text-yellow-600 ml-1'}>
                            {user.profileComplete ? 'Complete' : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    )}

                    {user.role === 'recruiter' && (
                      <div className="mt-2 flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span className="font-medium">Company:</span>
                        <span className="ml-1">{user.company}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Jobs Posted:</span>
                        <span className="ml-1">{user.jobsPosted}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Edit
                  </button>
                  <button className="text-sm text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </div>
                <div className="flex space-x-3">
                  <button className="text-red-600 hover:text-red-800 font-medium">
                    Deactivate
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}