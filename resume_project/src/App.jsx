import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Homepage from './pages/Homepage.jsx'
import Navbar from './components/common/Navbar.jsx'

// Auth Pages
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard.jsx'
import CandidateProfile from './pages/candidate/Profile.jsx'
import JobSearch from './pages/candidate/JobSearch.jsx'
import Applications from './pages/candidate/Applications.jsx'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard.jsx'
import PostJob from './pages/recruiter/PostJob.jsx'
import ViewApplications from './pages/recruiter/ViewApplications.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <Homepage /> : <Navigate to={`/${user.role}/dashboard`} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} />} />
        
        {/* Candidate Routes */}
        <Route path="/candidate/dashboard" element={user?.role === 'candidate' ? <CandidateDashboard /> : <Navigate to="/login" />} />
        <Route path="/candidate/profile" element={user?.role === 'candidate' ? <CandidateProfile /> : <Navigate to="/login" />} />
        <Route path="/candidate/jobs" element={user?.role === 'candidate' ? <JobSearch /> : <Navigate to="/login" />} />
        <Route path="/candidate/applications" element={user?.role === 'candidate' ? <Applications /> : <Navigate to="/login" />} />
        
        {/* Recruiter Routes */}
        <Route path="/recruiter/dashboard" element={user?.role === 'recruiter' ? <RecruiterDashboard /> : <Navigate to="/login" />} />
        <Route path="/recruiter/post-job" element={user?.role === 'recruiter' ? <PostJob /> : <Navigate to="/login" />} />
        <Route path="/recruiter/applications" element={user?.role === 'recruiter' ? <ViewApplications /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/login" />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App