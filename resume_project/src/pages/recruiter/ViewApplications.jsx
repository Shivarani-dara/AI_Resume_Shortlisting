import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Mail, Phone, Star, Calendar, MapPin, Briefcase } from 'lucide-react'

export default function ViewApplications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState('')
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJob) {
      fetchApplications(selectedJob)
    }
  }, [selectedJob])

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/jobs')
      const data = await response.json()
      setJobs(data)
      if (data.length > 0) {
        setSelectedJob(data[0]._id)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchApplications = async (jobId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/rank/${jobId}`)
      const data = await response.json()
      const formattedApplications = data.map(app => ({
        id: app.applicationId,
        name: app.extracted?.name || app.filename,
        email: app.extracted?.email || '',
        phone: app.extracted?.phone || '',
        position: jobs.find(j => j._id === jobId)?.title || 'Position',
        appliedDate: new Date(app.appliedAt).toISOString().split('T')[0],
        status: app.status,
        matchScore: app.score,
        experience: 'N/A', // Could be extracted from resume
        location: app.extracted?.location || 'N/A',
        skills: app.extracted?.skills || [],
        resume: app.filename,
        notes: app.rationale ? app.rationale.join('; ') : '',
        lastActive: 'N/A',
        avatar: (app.extracted?.name || app.filename).split(' ').map(n => n[0]).join('').toUpperCase(),
        resumeId: app.resumeId
      }))
      setApplications(formattedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const statuses = [
    { id: 'all', name: 'All Applications', color: 'gray', count: applications.length },
    { id: 'new', name: 'New', color: 'blue', count: applications.filter(app => app.status === 'new').length },
    { id: 'shortlisted', name: 'Shortlisted', color: 'green', count: applications.filter(app => app.status === 'shortlisted').length },
    { id: 'interview', name: 'Interview', color: 'purple', count: applications.filter(app => app.status === 'interview').length },
    { id: 'rejected', name: 'Rejected', color: 'red', count: 0 }
  ]

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200'
      case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Applications</h1>
          <p className="text-gray-600">Manage and review all job applications</p>
        </div>

        {/* Stats & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidates</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, position, or skills..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name} ({status.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                <Filter className="h-5 w-5" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredApplications.length} Applications Found
          </h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200">
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {application.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{application.name}</h3>
                      <p className="text-gray-600">{application.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-600 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold text-sm">{application.matchScore}%</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {application.phone}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    {application.experience}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {application.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    Active: {application.lastActive}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {application.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Notes</div>
                    <div className="text-sm text-yellow-700">{application.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    View Profile
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
                    Schedule
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}