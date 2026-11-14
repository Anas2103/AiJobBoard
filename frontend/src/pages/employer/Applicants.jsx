import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import { AiScoreBar } from '../../components/AiScoreBadge'
import toast from 'react-hot-toast'
import { Download, Users, ArrowLeft } from 'lucide-react'

export default function Applicants() {
  const { jobId } = useParams()
  const queryClient = useQueryClient()

  const { data: jobData } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.get(`/jobs/${jobId}`).then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['employer-applications', jobId],
    queryFn: () => api.get(`/employer/applications/${jobId}`).then(r => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/employer/applications/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['employer-applications', jobId] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const applications = data?.data?.data || []
  const job = jobData?.data

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link to="/employer/jobs" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {job ? `Applicants for: ${job.title}` : 'Applicants'}
            </h1>
            {applications.length > 0 && (
              <p className="text-sm text-slate-500 mt-0.5">{applications.length} applications</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Users size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No applications yet for this job</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Candidate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Applied</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-36">AI Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Update</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">CV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 text-sm">{app.user?.name}</p>
                        <p className="text-xs text-slate-500">{app.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 w-36">
                        <AiScoreBar score={app.ai_score} feedback={app.ai_feedback} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}
                          disabled={app.status === 'pending' ? false : false}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="pending" disabled>pending</option>
                          <option value="reviewed">reviewed</option>
                          <option value="accepted">accepted</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`http://localhost:8000/storage/${app.cv_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        >
                          <Download size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
