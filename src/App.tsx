import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireActiveLearning, RequireAuth } from './components/Guards'
import { AdminLayout, LearnerLayout } from './components/layouts'
import {
  AdminChaptersPage,
  AdminDashboard,
  AdminQuestionsPage,
  AdminUsersPage,
} from './pages/admin/AdminPages'
import { LoginPage } from './pages/Auth'
import { LandingPage } from './pages/Landing'
import { ChapterPage, CoursesPage } from './pages/learner/Courses'
import { LearnerDashboard } from './pages/learner/Dashboard'
import { ExamPage } from './pages/learner/Exam'
import {
  ArchivePage,
  ExamResultPage,
  ProfilePage,
} from './pages/learner/History'
import { PracticePage } from './pages/learner/Practice'
import { AppProvider, useApp } from './store/AppContext'

function LearnerHome() {
  const { suspended } = useApp()
  if (suspended) return <Navigate to="/app/archive" replace />
  return <LearnerDashboard />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth role="LEARNER" />}>
            <Route path="/app" element={<LearnerLayout />}>
              <Route index element={<LearnerHome />} />
              <Route path="archive" element={<ArchivePage />} />
              <Route path="exam/result/:id" element={<ExamResultPage />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route element={<RequireActiveLearning />}>
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:slug" element={<ChapterPage />} />
                <Route path="practice" element={<PracticePage />} />
                <Route path="exam" element={<ExamPage />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RequireAuth role="ADMIN" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="chapters" element={<AdminChaptersPage />} />
              <Route path="questions" element={<AdminQuestionsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
