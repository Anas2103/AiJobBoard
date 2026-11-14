import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/axios'
import Layout from '../components/Layout'
import JobCard from '../components/JobCard'
import Pagination from '../components/Pagination'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { Search, MapPin, Filter, X } from 'lucide-react'

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'hybrid']

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, location, selectedTypes, page],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (location) params.set('location', location)
      selectedTypes.forEach(t => params.append('type[]', t))
      params.set('page', page)
      return api.get(`/jobs?${params.toString()}`).then(r => r.data)
    },
  })

  const jobs = data?.data?.data || []
  const meta = data?.data

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
    setPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    setSelectedTypes([])
    setPage(1)
  }

  const hasFilters = search || location || selectedTypes.length > 0

  return (
    <Layout>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Browse Jobs</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 border border-slate-300 rounded-lg bg-white">
              <Search className="text-slate-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title or keyword"
                className="flex-1 py-2.5 text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border border-slate-300 rounded-lg bg-white min-w-48">
              <MapPin className="text-slate-400" size={16} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="flex-1 py-2.5 text-sm text-slate-700 focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Filter size={14} /> Filters
                </h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700">Clear</button>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Job Type</p>
                <div className="space-y-2">
                  {JOB_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm text-slate-600 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {isLoading ? 'Loading...' : `${meta?.total || 0} jobs found`}
              </p>
              {hasFilters && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      "{search}" <button onClick={() => { setSearch(''); setPage(1) }}><X size={10} /></button>
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {location} <button onClick={() => { setLocation(''); setPage(1) }}><X size={10} /></button>
                    </span>
                  )}
                  {selectedTypes.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
                      {t} <button onClick={() => toggleType(t)}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <LoadingSkeleton count={6} />
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
                <Pagination
                  meta={{ current_page: meta?.current_page, last_page: meta?.last_page, total: meta?.total }}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-slate-600 font-medium">No jobs found</h3>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
