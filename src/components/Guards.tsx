import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export function RequireAuth({ role }: { role?: 'LEARNER' | 'ADMIN' }) {
  const { currentUser, ready, logout } = useApp()

  useEffect(() => {
    if (role === 'LEARNER' && currentUser?.status === 'BLOCKED') {
      logout()
    }
  }, [role, currentUser?.status, logout])

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center font-bold text-brand">
        جاري التحميل...
      </div>
    )
  }
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) {
    return (
      <Navigate to={currentUser.role === 'ADMIN' ? '/admin' : '/app'} replace />
    )
  }
  if (role === 'LEARNER' && currentUser.status === 'BLOCKED') {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

/** Courses / practice / new exam — active accounts only */
export function RequireActiveLearning() {
  const { learningAccess, suspended } = useApp()
  if (!learningAccess) {
    return <Navigate to={suspended ? '/app/archive' : '/app/profile'} replace />
  }
  return <Outlet />
}
