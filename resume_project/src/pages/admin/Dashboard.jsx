import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Settings, Database, Shield, Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const systemStats = [
    { name: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600' },
    { name: 'Active Jobs', value: '567', change: '+8%', icon: Database, color: 'text-green-600' },
    { name: 'Resumes Parsed', value: '8,901', change: '+23%', icon: Activity, color: 'text-purple-600' },
    { name: 'System Health', value: '100%', change: 'Stable', icon: Shield, color: 'text-emerald-600' }
  ]

  const recentActivities = [
    { id: 1, action: 'New user registration', user: 'john@example.com', time: '2 minutes ago', type: 'user', status: 'success' },
    { id: 2, action: 'Job posted', user: 'TechCorp Inc.', time: '5 minutes ago', type: 'job', status: 'success' },
    { id: 3, action: 'System backup completed', user: 'System', time: '10 minutes ago', type: 'system', status: 'success' },
    { id: 4, action: 'Security alert resolved', user: 'Admin', time: '15 minutes ago', type: 'security', status: 'warning' }
  ]

  const systemStatus = [
    { service: 'AI Resume Parser', status: 'operational', latency: '120ms' },
    { service: 'Job Matching Engine', status: 'operational', latency: '85ms' },
    { service: 'Database Cluster', status: 'operational', latency: '45ms' },
    { service: 'Email Service', status: 'degraded', latency: '320ms' }
  ]

  const getStatusColor = (status) => {
    return status === 'operational' ? 'text-green-600 bg-green-100' : 
           status === 'degraded' ? 'text-yellow-600 bg-yellow-100' : 
           'text-red-600 bg-red-100'
  }

  const getTypeColor = (type) => {
    return type === 'user' ? 'bg-blue-100 text-blue-600' :
           type === 'job' ? 'bg-green-100 text-green-600' :
           type === 'system' ? 'bg-purple-100 text-purple-600' :
           'bg-red-100 text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">Monitor and manage platform operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-sm font-semibold ${
                    stat.change === 'Stable' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.name}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.service}</h3>
                    <p className="text-sm text-gray-500">Latency: {service.latency}</p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status === 'operational' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'job' && <Database className="h-4 w-4" />}
                    {activity.type === 'system' && <Settings className="h-4 w-4" />}
                    {activity.type === 'security' && <Shield className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.action}</h3>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{activity.time}</div>
                    <div className={`inline-flex items-center mt-1 ${
                      activity.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs font-medium">
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
            >
              <Users className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
              <p className="text-sm text-gray-600">Manage all platform users</p>
            </Link>
            
            <Link
              to="/admin/settings"
              className="p-4 rounded-lg border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-all duration-200 group"
            >
              <Settings className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">System Settings</h3>
              <p className="text-sm text-gray-600">Configure platform settings</p>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 group"
            >
              <Activity className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">View platform analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}