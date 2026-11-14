import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'
import { PlusCircle, Edit, Trash2, Users, Eye, Briefcase } from 'lucide-react'

export default function EmployerJobs() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => api.get('/employer/jobs').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/jobs/${id}`),
    onSuccess: () => {
      toast.success('Job deleted')
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] })
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete job'),
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/jobs/${id}`, { status }),
    onSuccess: () => {
      toast.success('Job status updated')
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] })
    },
  })

  const jobs = data?.data?.data || []

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Job Listings</h1>
          <Link to="/employer/jobs/new" className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <PlusCircle size={16} /> Post New Job
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No jobs posted yet</p>
            <Link to="/employer/jobs/new" className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <PlusCircle size={14} /> Post your first job
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Applications</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Posted</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 text-sm">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.location}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={job.type} /></td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-slate-600">
                          <Users size={14} /> {job.applications_count}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatusMutation.mutate({ id: job.id, status: job.status === 'open' ? 'closed' : 'open' })}
                          className="focus:outline-none"
                        >
                          <StatusBadge status={job.status} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/employer/applications/${job.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Applicants">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/employer/jobs/${job.id}/edit`} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Edit size={14} />
                          </Link>
                          <button onClick={() => setDeleteId(job.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
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
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete Job"
        message="This will permanently delete the job and all applications. Are you sure?"
      />
    </DashboardLayout>
  )
}
