import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import { Briefcase, ChevronDown, LogOut, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    return `/${user.role}/dashboard`
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900">HireMatch</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Browse Jobs
            </Link>
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{user?.name}</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={14} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <Link to="/jobs" className="block text-slate-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="block text-slate-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-600 font-medium py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-slate-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block bg-blue-600 text-white text-center font-medium py-2 rounded-lg" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
