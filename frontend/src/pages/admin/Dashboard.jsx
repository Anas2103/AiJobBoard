import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'
import { Users, Briefcase, FileText, Building2, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const [deleteUser, setDeleteUser] = useState(null)
  const [deleteJob, setDeleteJob] = useState(null)

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
  })

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => api.get('/admin/jobs').then(r => r.data),
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      setDeleteUser(null)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const deleteJobMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/jobs/${id}`),
    onSuccess: () => {
      toast.success('Job deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      setDeleteJob(null)
    },
    onError: () => toast.error('Failed'),
  })

  const stats = statsData?.data || {}
  const users = usersData?.data?.data || []
  const jobs = jobsData?.data?.data || []

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Jobs', value: stats.total_jobs, icon: Briefcase, color: 'text-green-600 bg-green-50' },
    { label: 'Applications', value: stats.total_applications, icon: FileText, color: 'text-purple-600 bg-purple-50' },
    { label: 'Companies', value: stats.total_companies, icon: Building2, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users table */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Users</h2>
            </div>
            {usersLoading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Name</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Role</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.slice(0, 10).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <p className="text-sm font-medium text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'employer' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => setDeleteUser(user)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Jobs table */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Jobs</h2>
            </div>
            {jobsLoading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Title</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.slice(0, 10).map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <p className="text-sm font-medium text-slate-800">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.company?.name}</p>
                        </td>
                        <td className="px-4 py-2.5"><StatusBadge status={job.status} /></td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => setDeleteJob(job)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => deleteUserMutation.mutate(deleteUser.id)}
        loading={deleteUserMutation.isPending}
        title={`Delete ${deleteUser?.name}?`}
        message="This will permanently delete the user and all their data."
      />

      <ConfirmModal
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        onConfirm={() => deleteJobMutation.mutate(deleteJob.id)}
        loading={deleteJobMutation.isPending}
        title={`Delete "${deleteJob?.title}"?`}
        message="This will permanently delete the job and all applications."
      />
    </DashboardLayout>
  )
}
