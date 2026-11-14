export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 bg-slate-200 rounded-full w-20" />
        <div className="h-6 bg-slate-200 rounded-full w-24" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded" />
        </td>
      ))}
    </tr>
  )
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}
