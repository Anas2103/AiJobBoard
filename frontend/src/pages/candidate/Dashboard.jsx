import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import AiScoreBadge from '../../components/AiScoreBadge'
import StatusBadge from '../../components/StatusBadge'
import { FileText, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react'

export default function CandidateDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get('/applications').then(r => r.data),
  })

  const applications = data?.data?.data || []
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  const statCards = [
    { label: 'Total Applied', value: stats.total, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No applications yet</p>
              <Link to="/jobs" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Browse Jobs</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-600 font-bold text-sm">{app.job?.company?.name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{app.job?.title}</p>
                    <p className="text-xs text-slate-500">{app.job?.company?.name}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <AiScoreBadge score={app.ai_score} feedback={app.ai_feedback} />
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
