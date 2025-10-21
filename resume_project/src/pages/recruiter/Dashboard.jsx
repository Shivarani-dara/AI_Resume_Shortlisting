import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, TrendingUp, MessageCircle, FileText, Zap, Target, BarChart3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RecruiterDashboard() {
  const { user, getAuthHeaders } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecruiterData()
  }, [])

  const fetchRecruiterData = async () => {
    try {
      // Fetch jobs posted by this recruiter
      const jobsResponse = await fetch('http://localhost:8080/api/jobs', {
        headers: getAuthHeaders()
      })
      const jobsData = await jobsResponse.json()
      // Filter jobs by this recruiter
      const recruiterJobs = jobsData.filter(job => job.employerId === user.id)
      setJobs(recruiterJobs)

      // Fetch applications for recruiter's jobs
      const applicationsData = []
      for (const job of recruiterJobs) {
        try {
          const appResponse = await fetch(`http://localhost:8080/api/applications/job/${job._id}`, {
            headers: getAuthHeaders()
          })
          const jobApps = await appResponse.json()
          applicationsData.push(...jobApps)
        } catch (error) {
          console.error(`Error fetching applications for job ${job._id}:`, error)
        }
      }
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error fetching recruiter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { name: 'Active Jobs', value: jobs.length.toString(), change: '+12%', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { name: 'Total Candidates', value: applications.length.toString(), change: '+8%', icon: Users, color: 'from-green-500 to-emerald-500' },
    { name: 'Applications', value: applications.length.toString(), change: '+23%', icon: FileText, color: 'from-purple-500 to-pink-500' },
    { name: 'Interviews', value: applications.filter(app => app.status === 'interview').length.toString(), change: '+5%', icon: MessageCircle, color: 'from-orange-500 to-red-500' }
  ]

  const recentApplications = applications.slice(0, 3).map(app => ({
    id: app._id,
    name: app.resumeId?.name || 'Unknown Candidate',
    position: jobs.find(job => job._id === app.jobId)?.title || 'Unknown Position',
    status: app.status,
    time: new Date(app.appliedAt).toLocaleDateString(),
    match: app.atsScore || 85,
    avatar: (app.resumeId?.name || 'UC').split(' ').map(n => n[0]).join('').toUpperCase()
  }))

  const aiInsights = [
    { title: 'Top Skills in Demand', value: 'React, Node.js, TypeScript', trend: 'Increasing' },
    { title: 'Average Time to Hire', value: '18 days', trend: 'Decreasing' },
    { title: 'Candidate Quality Score', value: '8.7/10', trend: 'Improving' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 text-lg">Manage your hiring pipeline efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.name} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                    {item.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{item.value}</h3>
                <p className="text-gray-400 text-sm">{item.name}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">AI Insights</h2>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/30">
                    <h3 className="text-sm font-semibold text-gray-300 mb-1">{insight.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{insight.value}</span>
                      <span className="text-green-400 text-sm font-medium">{insight.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/recruiter/post-job"
                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 group"
                  >
                    <Target className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Post New Job</span>
                  </Link>
                  <Link
                    to="/recruiter/applications"
                    className="flex items-center gap-3 p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 group"
                  >
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium">View Applications</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                <Link to="/recruiter/applications" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentApplications.length > 0 ? recentApplications.map((application) => (
                  <div key={application.id} className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {application.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{application.name}</h3>
                          <p className="text-gray-400 text-sm">{application.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          application.status === 'shortlisted' ? 'bg-green-900/30 text-green-400' :
                          application.status === 'interview' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {application.status}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{application.time}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <BarChart3 className="h-4 w-4" />
                          Match Score: <span className="font-semibold text-white">{application.match}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Profile
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No applications yet. Post a job to start receiving applications!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
