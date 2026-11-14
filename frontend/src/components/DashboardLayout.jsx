import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Navbar from './Navbar'
import {
  LayoutDashboard, Briefcase, FileText, Heart,
  Users, Settings, PlusCircle
} from 'lucide-react'

const candidateNav = [
  { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/candidate/applications', icon: FileText, label: 'My Applications' },
  { to: '/candidate/saved', icon: Heart, label: 'Saved Jobs' },
  { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
]

const employerNav = [
  { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/employer/jobs/new', icon: PlusCircle, label: 'Post a Job' },
]

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' },
]

export default function DashboardLayout({ children }) {
  const { user } = useAuthStore()
  const location = useLocation()

  const navItems = user?.role === 'candidate'
    ? candidateNav
    : user?.role === 'employer'
    ? employerNav
    : adminNav

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider capitalize">{user?.role} Portal</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 truncate">{user?.name}</p>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === to
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
