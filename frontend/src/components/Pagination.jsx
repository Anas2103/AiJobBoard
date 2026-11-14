import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const pages = []
  const { current_page, last_page } = meta

  for (let i = Math.max(1, current_page - 2); i <= Math.min(last_page, current_page + 2); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(current_page - 1)}
        disabled={current_page === 1}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-sm">1</button>
          {pages[0] > 2 && <span className="text-slate-400">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
            page === current_page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-slate-200 hover:bg-slate-100'
          }`}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] < last_page && (
        <>
          {pages[pages.length - 1] < last_page - 1 && <span className="text-slate-400">...</span>}
          <button onClick={() => onPageChange(last_page)} className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-sm">{last_page}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(current_page + 1)}
        disabled={current_page === last_page}
        className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
