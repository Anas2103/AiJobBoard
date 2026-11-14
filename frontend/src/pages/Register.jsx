import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'
import { useState } from 'react'

const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role: z.enum(['candidate', 'employer'], { required_error: 'Please select a role' }),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name required'),
  company_description: z.string().min(10, 'Description required'),
  company_location: z.string().min(2, 'Location required'),
  company_website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [step, setStep] = useState(1)
  const [accountData, setAccountData] = useState(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(accountSchema),
  })

  const companyForm = useForm({ resolver: zodResolver(companySchema) })

  const registerMutation = useMutation({
    mutationFn: (data) => api.post('/auth/register', data),
    onSuccess: (res) => {
      const { user, token } = res.data.data
      login(user, token)
      toast.success('Account created!')
      navigate('/candidate/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed')
    },
  })

  const companyMutation = useMutation({
    mutationFn: async (companyData) => {
      // Register first
      const regRes = await api.post('/auth/register', accountData)
      const { user, token } = regRes.data.data
      login(user, token)

      // Create company
      await api.post('/company', {
        name: companyData.company_name,
        description: companyData.company_description,
        location: companyData.company_location,
        website: companyData.company_website || undefined,
      })
      return user
    },
    onSuccess: (user) => {
      toast.success('Account and company created!')
      navigate('/employer/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed')
    },
  })

  const onAccountSubmit = (data) => {
    if (data.role === 'employer') {
      setAccountData(data)
      setStep(2)
    } else {
      registerMutation.mutate(data)
    }
  }

  const role = watch('role')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Briefcase className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-900">HireMatch</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 1 ? 'Create an account' : 'Set up your company'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {step === 1 ? 'Join thousands finding their perfect match' : 'Tell us about your company'}
          </p>
          {step === 2 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">✓</span>
              <div className="w-12 h-0.5 bg-blue-600" />
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">2</span>
            </div>
          )}
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input {...register('name')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input {...register('email')} type="email" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input {...register('password')} type="password" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Min. 8 characters" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input {...register('password_confirmation')} type="password" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Repeat password" />
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['candidate', 'employer'].map((r) => (
                  <label key={r} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${role === r ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input {...register('role')} type="radio" value={r} className="sr-only" />
                    <span className="text-sm font-medium capitalize">{r}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {registerMutation.isPending ? 'Creating...' : role === 'employer' ? 'Next: Company Info →' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={companyForm.handleSubmit((d) => companyMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input {...companyForm.register('company_name')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {companyForm.formState.errors.company_name && <p className="text-red-500 text-xs mt-1">{companyForm.formState.errors.company_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea {...companyForm.register('company_description')} rows={3} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              {companyForm.formState.errors.company_description && <p className="text-red-500 text-xs mt-1">{companyForm.formState.errors.company_description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input {...companyForm.register('company_location')} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="City, Country" />
              {companyForm.formState.errors.company_location && <p className="text-red-500 text-xs mt-1">{companyForm.formState.errors.company_location.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website (optional)</label>
              <input {...companyForm.register('company_website')} type="url" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://yourcompany.com" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm">
                Back
              </button>
              <button type="submit" disabled={companyMutation.isPending} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm">
                {companyMutation.isPending ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
