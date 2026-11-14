import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="text-white font-bold text-lg">HireMatch</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} HireMatch. AI-Powered Job Matching.</p>
        </div>
      </div>
    </footer>
  )
}
