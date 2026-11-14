import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'
import { Heart, MapPin, DollarSign, Briefcase } from 'lucide-react'

export default function SavedJobs() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => api.get('/saved-jobs').then(r => r.data),
  })

  const unsaveMutation = useMutation({
    mutationFn: (jobId) => api.post(`/jobs/${jobId}/save`),
    onSuccess: () => {
      toast.success('Job removed from saved')
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
  })

  const savedJobs = data?.data?.data || []

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    return fmt(min || max)
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Saved Jobs</h1>

        {isLoading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Heart size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No saved jobs yet</p>
            <Link to="/jobs" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Browse Jobs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((saved) => (
              <div key={saved.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {saved.job?.company?.logo ? (
                        <img src={`http://localhost:8000/storage/${saved.job.company.logo}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-600 font-bold">{saved.job?.company?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <Link to={`/jobs/${saved.job?.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm">
                        {saved.job?.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{saved.job?.company?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => unsaveMutation.mutate(saved.job_id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={saved.job?.type} />
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={10} />{saved.job?.location}</span>
                  {formatSalary(saved.job?.salary_min, saved.job?.salary_max) && (
                    <span className="flex items-center gap-1 text-xs text-slate-500"><DollarSign size={10} />{formatSalary(saved.job?.salary_min, saved.job?.salary_max)}</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/jobs/${saved.job?.id}`} className="flex-1 text-center py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
