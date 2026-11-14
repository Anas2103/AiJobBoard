const colors = {
  pending: 'bg-slate-100 text-slate-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  open: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-500',
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-purple-100 text-purple-700',
  'remote': 'bg-green-100 text-green-700',
  'hybrid': 'bg-amber-100 text-amber-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}
