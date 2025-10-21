import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Users, Briefcase, Settings, ArrowLeft } from 'lucide-react'

export default function Register() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'candidate'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  })
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const roles = [
    {
      id: 'candidate',
      title: 'Job Seeker',
      icon: Users,
      description: 'Looking for job opportunities',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      icon: Briefcase,
      description: 'Hiring talent for your company',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'admin',
      title: 'Administrator',
      icon: Settings,
      description: 'Manage platform operations',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register(formData.name, formData.email, formData.password, formData.role)

    if (result.success) {
      navigate(`/${formData.role}/dashboard`)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join our AI-powered job platform</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon
                const isSelected = formData.role === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({...formData, role: role.id})}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? `border-transparent bg-gradient-to-r ${role.gradient} text-white shadow-lg` 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{role.title}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating Account...' : `Create Account as ${roles.find(r => r.id === formData.role)?.title}`}
            </button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}