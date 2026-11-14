import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
