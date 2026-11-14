import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import { Briefcase, Users, PlusCircle, TrendingUp } from 'lucide-react'

export default function EmployerDashboard() {
  const { data: jobsData } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => api.get('/employer/jobs').then(r => r.data),
  })

  const jobs = jobsData?.data?.data || []
  const totalApps = jobs.reduce((s, j) => s + (j.applications_count || 0), 0)
  const openJobs = jobs.filter(j => j.status === 'open').length

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
          <Link to="/employer/jobs/new" className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <PlusCircle size={16} /> Post a Job
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
              <Briefcase className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
            <p className="text-sm text-slate-500">Total Jobs Posted</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{openJobs}</p>
            <p className="text-sm text-slate-500">Open Positions</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
              <Users className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalApps}</p>
            <p className="text-sm text-slate-500">Total Applications</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Job Posts</h2>
            <Link to="/employer/jobs" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No jobs posted yet</p>
              <Link to="/employer/jobs/new" className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <PlusCircle size={14} /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{job.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{job.type} · {job.location}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users size={12} /> {job.applications_count}
                    </span>
                    <StatusBadge status={job.status} />
                    <Link to={`/employer/applications/${job.id}`} className="text-xs text-blue-600 hover:underline">
                      View
                    </Link>
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
