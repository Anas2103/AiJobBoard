import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import { Briefcase, Eye, EyeOff, Zap } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const demoAccounts = [
  { label: 'Admin', email: 'admin@hirematch.com', password: 'Admin123!', color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
  { label: 'Employer', email: 'alice@techcorp.com', password: 'Password123!', color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { label: 'Candidate', email: 'david@candidate.com', password: 'Password123!', color: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  })

  const fillDemo = (email, password) => {
    setValue('email', email, { shouldValidate: false })
    setValue('password', password, { shouldValidate: false })
  }

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/login', data),
    onSuccess: (res) => {
      const { user, token } = res.data.data
      login(user, token)
      toast.success('Welcome back!')
      const dashboards = { candidate: '/candidate/dashboard', employer: '/employer/dashboard', admin: '/admin/dashboard' }
      navigate(dashboards[user.role] || '/')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed. Make sure the backend server is running.')
    },
  })

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
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Demo account quick-fill buttons */}
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Zap size={12} />
            Quick Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map(({ label, email, password, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => fillDemo(email, password)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${color}`}
              >
                <span>{label}</span>
                <span className="font-normal opacity-70 text-[10px] truncate w-full text-center">Click to fill</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
