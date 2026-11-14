import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import DashboardLayout from '../../components/DashboardLayout'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'remote', 'hybrid'], { required_error: 'Job type is required' }),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  status: z.enum(['open', 'closed']).default('open'),
})

export default function JobForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const { data: jobData } = useQuery({
    queryKey: ['job-edit', id],
    queryFn: () => api.get(`/jobs/${id}`).then(r => r.data),
    enabled: isEditing,
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'open' },
  })

  useEffect(() => {
    if (jobData?.data) {
      const j = jobData.data
      reset({
        title: j.title,
        description: j.description,
        requirements: j.requirements,
        location: j.location,
        type: j.type,
        salary_min: j.salary_min?.toString() || '',
        salary_max: j.salary_max?.toString() || '',
        status: j.status,
      })
    }
  }, [jobData, reset])

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        salary_min: data.salary_min ? parseInt(data.salary_min) : null,
        salary_max: data.salary_max ? parseInt(data.salary_max) : null,
      }
      return isEditing
        ? api.put(`/jobs/${id}`, payload)
        : api.post('/jobs', payload)
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Job updated!' : 'Job posted!')
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] })
      navigate('/employer/jobs')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save job'),
  })

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  const inputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{isEditing ? 'Edit Job' : 'Post a New Job'}</h1>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5 bg-white rounded-xl border border-slate-200 p-6">
          <Field label="Job Title *" error={errors.title?.message}>
            <input {...register('title')} className={inputClass} placeholder="e.g. Senior React Developer" />
          </Field>

          <Field label="Job Description *" error={errors.description?.message}>
            <textarea {...register('description')} rows={5} className={`${inputClass} resize-none`} placeholder="Describe the role, responsibilities, and what the day-to-day looks like..." />
          </Field>

          <Field label="Requirements *" error={errors.requirements?.message}>
            <textarea {...register('requirements')} rows={4} className={`${inputClass} resize-none`} placeholder="List the skills, experience, and qualifications required..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location *" error={errors.location?.message}>
              <input {...register('location')} className={inputClass} placeholder="City, Country or Remote" />
            </Field>
            <Field label="Job Type *" error={errors.type?.message}>
              <select {...register('type')} className={inputClass}>
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Min Salary (optional)" error={errors.salary_min?.message}>
              <input {...register('salary_min')} type="number" min="0" className={inputClass} placeholder="e.g. 60000" />
            </Field>
            <Field label="Max Salary (optional)" error={errors.salary_max?.message}>
              <input {...register('salary_max')} type="number" min="0" className={inputClass} placeholder="e.g. 90000" />
            </Field>
          </div>

          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className={inputClass}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/employer/jobs')} className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
