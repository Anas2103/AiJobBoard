import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './lib/queryClient'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Login from './pages/Login'
import Register from './pages/Register'

import CandidateDashboard from './pages/candidate/Dashboard'
import MyApplications from './pages/candidate/Applications'
import SavedJobs from './pages/candidate/SavedJobs'

import EmployerDashboard from './pages/employer/Dashboard'
import EmployerJobs from './pages/employer/Jobs'
import JobForm from './pages/employer/JobForm'
import Applicants from './pages/employer/Applicants'

import AdminDashboard from './pages/admin/Dashboard'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute roles={['candidate']}>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/candidate/saved" element={
            <ProtectedRoute roles={['candidate']}>
              <SavedJobs />
            </ProtectedRoute>
          } />

          {/* Employer */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute roles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer/jobs" element={
            <ProtectedRoute roles={['employer']}>
              <EmployerJobs />
            </ProtectedRoute>
          } />
          <Route path="/employer/jobs/new" element={
            <ProtectedRoute roles={['employer']}>
              <JobForm />
            </ProtectedRoute>
          } />
          <Route path="/employer/jobs/:id/edit" element={
            <ProtectedRoute roles={['employer']}>
              <JobForm />
            </ProtectedRoute>
          } />
          <Route path="/employer/applications/:jobId" element={
            <ProtectedRoute roles={['employer']}>
              <Applicants />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </QueryClientProvider>
  )
}
