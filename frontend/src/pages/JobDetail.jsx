import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import FileUpload from '../components/FileUpload'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import {
  MapPin, Clock, DollarSign, Users, Globe, Heart, X, Send, Building2
} from 'lucide-react'

export default function JobDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [cvError, setCvError] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get(`/jobs/${id}`).then(r => r.data),
  })

  const { data: myApps } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get('/applications').then(r => r.data),
    enabled: isAuthenticated && user?.role === 'candidate',
  })

  const { data: savedData } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => api.get('/saved-jobs').then(r => r.data),
    enabled: isAuthenticated && user?.role === 'candidate',
  })

  const job = data?.data
  const savedJobIds = (savedData?.data?.data || []).map(s => s.job_id)
  const hasApplied = (myApps?.data?.data || []).some(a => a.job_id === parseInt(id))

  const toggleSave = useMutation({
    mutationFn: () => api.post(`/jobs/${id}/save`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
  })

  const applyMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      formData.append('cv', cvFile)
      if (coverLetter) formData.append('cover_letter', coverLetter)
      return api.post(`/jobs/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      toast.success('Application submitted!')
      setShowApplyModal(false)
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Application failed'),
  })

  const handleApply = () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!cvFile) { setCvError('Please upload your CV'); return }
    setCvError('')
    applyMutation.mutate()
  }

  const handleFileSelect = (file, err) => {
    if (err) { setCvError(err); setCvFile(null) }
    else { setCvFile(file); setCvError('') }
  }

  if (isLoading) {
    return <Layout><div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Loading...</div></Layout>
  }

  if (!job) {
    return <Layout><div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">Job not found</div></Layout>
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified'
    const fmt = (n) => `$${n.toLocaleString()}`
    if (min && max) return `${fmt(min)} - ${fmt(max)}/year`
    if (min) return `From ${fmt(min)}/year`
    return `Up to ${fmt(max)}/year`
  }

  const isSaved = savedJobIds.includes(job.id)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.company?.logo ? (
                    <img src={`http://localhost:8000/storage/${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-600 font-bold text-xl">{job.company?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                  <p className="text-slate-500 mt-1">{job.company?.name}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <StatusBadge status={job.type} />
                    <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} />{job.location}</span>
                    <span className="flex items-center gap-1 text-sm text-slate-500"><DollarSign size={14} />{formatSalary(job.salary_min, job.salary_max)}</span>
                    <span className="flex items-center gap-1 text-sm text-slate-500"><Users size={14} />{job.applications_count || 0} applicants</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Job Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Requirements</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex flex-col gap-3">
                {hasApplied ? (
                  <div className="w-full bg-green-50 text-green-700 font-medium py-3 rounded-xl text-center text-sm">
                    ✓ Already Applied
                  </div>
                ) : isAuthenticated && user?.role === 'candidate' ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Apply Now
                  </button>
                ) : !isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Sign In to Apply
                  </button>
                ) : null}

                {isAuthenticated && user?.role === 'candidate' && (
                  <button
                    onClick={() => toggleSave.mutate()}
                    className={`w-full py-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      isSaved ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    {isSaved ? 'Unsave Job' : 'Save Job'}
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-slate-400" size={14} />
                  <span className="text-slate-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <StatusBadge status={job.status} />
              </div>
            </div>

            {/* Company info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 size={16} /> About the Company
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {job.company?.logo ? (
                    <img src={`http://localhost:8000/storage/${job.company.logo}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-600 font-bold">{job.company?.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{job.company?.name}</p>
                  <p className="text-xs text-slate-500">{job.company?.location}</p>
                </div>
              </div>
              {job.company?.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{job.company.description}</p>
              )}
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:underline">
                  <Globe size={14} /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Apply for {job.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload CV *</label>
                <FileUpload onFileSelect={handleFileSelect} file={cvFile} error={cvError} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Tell the employer why you're a great fit..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowApplyModal(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                  className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
