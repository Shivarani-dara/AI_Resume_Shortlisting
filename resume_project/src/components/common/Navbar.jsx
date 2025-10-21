import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Briefcase, User, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">JobPortal</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.name}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user.role}
                </span>
                <Link 
                  to={`/${user.role}/dashboard`}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}