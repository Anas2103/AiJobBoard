import { useState } from 'react'
import { Brain } from 'lucide-react'

export default function AiScoreBadge({ score, feedback }) {
  const [showFeedback, setShowFeedback] = useState(false)

  if (score === null || score === undefined) {
    return <span className="text-xs text-slate-400">Analyzing...</span>
  }

  const color = score >= 70
    ? 'bg-green-100 text-green-700'
    : score >= 40
    ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700'

  const barColor = score >= 70
    ? 'bg-green-500'
    : score >= 40
    ? 'bg-amber-500'
    : 'bg-red-500'

  return (
    <div>
      <button
        onClick={() => setShowFeedback(!showFeedback)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color} cursor-pointer`}
      >
        <Brain size={12} />
        {score}% Match
      </button>
      {showFeedback && feedback && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 max-w-xs">
          <p className="font-medium text-slate-800 mb-1">AI Feedback</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  )
}

export function AiScoreBar({ score, feedback }) {
  const [showFeedback, setShowFeedback] = useState(false)

  if (score === null || score === undefined) {
    return <span className="text-xs text-slate-400">Analyzing...</span>
  }

  const barColor = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
  const textColor = score >= 70 ? 'text-green-700' : score >= 40 ? 'text-amber-700' : 'text-red-700'

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2">
          <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${score}%` }} />
        </div>
        <button onClick={() => setShowFeedback(!showFeedback)} className={`text-xs font-semibold ${textColor} min-w-8`}>
          {score}%
        </button>
      </div>
      {showFeedback && feedback && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <p className="font-medium text-slate-800 mb-1">AI Feedback</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  )
}
