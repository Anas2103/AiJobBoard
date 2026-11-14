import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import { AiScoreBar } from '../../components/AiScoreBadge'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'
import { Download, Trash2, Briefcase } from 'lucide-react'

export default function MyApplications() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => api.get('/applications').then(r => r.data),
  })

  const withdrawMutation = useMutation({
    mutationFn: (id) => api.delete(`/applications/${id}`),
    onSuccess: () => {
      toast.success('Application withdrawn')
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      setDeleteId(null)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to withdraw'),
  })

  const applications = data?.data?.data || []

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h1>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">You haven't applied to any jobs yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Job</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">AI Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 text-sm">{app.job?.title}</p>
                        <p className="text-xs text-slate-500">{app.job?.company?.name}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 w-32">
                        <AiScoreBar score={app.ai_score} feedback={app.ai_feedback} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`http://localhost:8000/storage/${app.cv_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download CV"
                          >
                            <Download size={14} />
                          </a>
                          {app.status === 'pending' && (
                            <button
                              onClick={() => setDeleteId(app.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Withdraw"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => withdrawMutation.mutate(deleteId)}
        loading={withdrawMutation.isPending}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application?"
        confirmText="Withdraw"
      />
    </DashboardLayout>
  )
}
