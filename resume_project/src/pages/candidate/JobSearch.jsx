import React, { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, DollarSign, Clock, Star, Filter, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function JobSearch() {
  const { getAuthHeaders } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/jobs')
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const skills = ['React', 'JavaScript', 'Node.js', 'Python', 'TypeScript', 'CSS', 'HTML', 'MongoDB']

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleApply = async (jobId) => {
    // Create a file input for PDF upload
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only.')
        return
      }

      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobId', jobId)

      try {
        const response = await fetch('http://localhost:8080/api/applications/upload', {
          method: 'POST',
          headers: {
            ...getAuthHeaders()
          },
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          alert(`Application submitted successfully! ATS Score: ${result.atsScore}%`)
          // Refresh jobs to update UI
          fetchJobs()
        } else {
          const errorData = await response.json()
          alert(`Failed to apply: ${errorData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error applying for job:', error)
        alert('Error applying for job')
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600">AI-powered job matching with intelligent recommendations</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title or Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs, skills, or companies..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or remote"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Job Matches</h2>
            <p className="text-gray-600">Jobs tailored to your skills and experience</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <Zap className="h-5 w-5" />
            Smart Matching Active
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No jobs found.</p>
            </div>
          ) : (
            jobs.map(job => {
              const salary = job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : job.salaryMin ? `$${job.salaryMin}+` : 'Salary not specified';
              const companyLogo = job.company ? job.company.split(' ').map(w => w[0]).join('').toUpperCase() : 'CO';
              return (
                <div key={job._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-white">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {companyLogo}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <p className="text-lg text-gray-700 font-medium">{job.company || 'Company'}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        {job.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                        {job.type || 'Type not specified'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                        {salary}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                        {job.applicationDeadline ? `Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}` : 'Open'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {job.skills && job.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleApply(job._id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}