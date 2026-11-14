import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const dashboardByRole = {
  candidate: '/candidate/dashboard',
  employer: '/employer/dashboard',
  admin: '/admin/dashboard',
}

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={dashboardByRole[user?.role] || '/'} replace />
  }

  return children
}
