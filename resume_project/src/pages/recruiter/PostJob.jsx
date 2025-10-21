import React, { useState } from 'react'
import { Briefcase, DollarSign, MapPin, Users, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PostJob() {
  const { getAuthHeaders } = useAuth()
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    skills: [],
    experience: '',
    applicationDeadline: ''
  })

  const [currentSkill, setCurrentSkill] = useState('')

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (currentSkill.trim() && !jobData.skills.includes(currentSkill.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(jobData),
      })
      if (response.ok) {
        alert('Job posted successfully!')
        setJobData({
          title: '',
          company: '',
          location: '',
          type: 'full-time',
          salaryMin: '',
          salaryMax: '',
          description: '',
          requirements: '',
          skills: [],
          experience: '',
          applicationDeadline: ''
        })
      } else {
        const errorData = await response.json()
        alert(`Failed to post job: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Error posting job')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Title *
              </label>
              <input
                type="text"
                required
                value={jobData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior React Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={jobData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                Location *
              </label>
              <input
                type="text"
                required
                value={jobData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. New York, NY or Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={jobData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 mr-2" />
                Salary Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={jobData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={jobData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Application Deadline
              </label>
              <input
                type="date"
                value={jobData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Required *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {jobData.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={jobData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              required
              rows={4}
              value={jobData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="List the required qualifications, experience, and education..."
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              required
              value={jobData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
              <option value="lead">Lead/Principal (8+ years)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Post Job
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}