import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import Layout from '../components/Layout'
import JobCard from '../components/JobCard'
import { Search, MapPin, Briefcase, Users, Building2, Brain, ArrowRight, ChevronRight } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  const { data: jobsData } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => api.get('/jobs?per_page=6').then(r => r.data),
  })

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [jobs, users] = await Promise.all([
        api.get('/jobs').then(r => r.data),
        api.get('/jobs').then(r => r.data),
      ])
      return {
        jobs: jobs.data?.total || 0,
      }
    },
    retry: false,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  const steps = [
    { icon: Search, title: 'Search Jobs', desc: 'Browse thousands of opportunities filtered by role, location, and salary.' },
    { icon: Brain, title: 'AI Matches You', desc: 'Our AI analyzes your CV against job requirements to give you a match score.' },
    { icon: Briefcase, title: 'Get Hired', desc: 'Apply with confidence knowing exactly how well you match the role.' },
  ]

  const jobs = jobsData?.data?.data || []

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-6">
              <Brain size={14} />
              <span>AI-Powered Job Matching</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect Job Match
              <span className="block text-blue-300">Powered by AI</span>
            </h1>
            <p className="text-blue-100 text-lg mb-10">
              Upload your CV and let our AI score your compatibility with every job. Stop guessing — start matching.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="text-slate-400 flex-shrink-0" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, skill, or company"
                  className="flex-1 py-2 text-slate-700 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-slate-200">
                <MapPin className="text-slate-400 flex-shrink-0" size={18} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Remote"
                  className="flex-1 py-2 text-slate-700 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center">
                Search <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{jobs.length > 0 ? '10+' : '0'}</p>
              <p className="text-sm text-slate-500 mt-1">Open Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">3+</p>
              <p className="text-sm text-slate-500 mt-1">Companies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">AI</p>
              <p className="text-sm text-slate-500 mt-1">Powered Matching</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How HireMatch Works</h2>
          <p className="text-slate-500 mt-2">Three simple steps to your dream job</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="text-blue-600" size={28} />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured jobs */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Jobs</h2>
              <p className="text-slate-500 text-sm mt-1">Latest opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 text-sm">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Briefcase size={48} className="mx-auto mb-3 text-slate-300" />
              <p>No jobs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect match?</h2>
          <p className="text-blue-100 mb-8">Join thousands of candidates who found their dream job using AI-powered matching.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Get Started Free
            </Link>
            <Link to="/jobs" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
