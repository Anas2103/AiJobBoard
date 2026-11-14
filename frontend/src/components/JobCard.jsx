import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Heart } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const typeColors = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  'remote': 'bg-green-100 text-green-700',
  'hybrid': 'bg-amber-100 text-amber-700',
}

export default function JobCard({ job, savedJobIds = [] }) {
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const isSaved = savedJobIds.includes(job.id)

  const toggleSave = useMutation({
    mutationFn: () => api.post(`/jobs/${job.id}/save`),
    onSuccess: (res) => {
      const saved = res.data.data.saved
      toast.success(saved ? 'Job saved!' : 'Job removed from saved')
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: () => toast.error('Failed to save job'),
  })

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    const fmt = (n) => `$${(n / 1000).toFixed(0)}k`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    return `Up to ${fmt(max)}`
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.company?.logo ? (
              <img src={`http://localhost:8000/storage/${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-600 font-bold text-lg">{job.company?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0">
            <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
              {job.title}
            </Link>
            <p className="text-sm text-slate-500 mt-0.5">{job.company?.name}</p>
          </div>
        </div>
        {isAuthenticated && user?.role === 'candidate' && (
          <button
            onClick={() => toggleSave.mutate()}
            disabled={toggleSave.isPending}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              isSaved ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-red-400 hover:bg-slate-100'
            }`}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${typeColors[job.type] || 'bg-slate-100 text-slate-600'}`}>
          {job.type}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} /> {job.location}
        </span>
        {formatSalary(job.salary_min, job.salary_max) && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <DollarSign size={12} /> {formatSalary(job.salary_min, job.salary_max)}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-2">{job.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={12} /> {new Date(job.created_at).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View Details →
        </Link>
      </div>
    </div>
  )
}
