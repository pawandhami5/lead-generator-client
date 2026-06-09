import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { FormPage } from '@/pages/FormPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

function PublicHeader() {
  const { isAdmin } = useAuth()

  const adminUrl = isAdmin ? '/admin/dashboard' : '/admin/login'

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <span className="font-semibold tracking-tight">Lead Distribution Portal </span>
        <a href={adminUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            Sign in as Admin
          </Button>
        </a>
      </div>
    </header>
  )
}

function AdminHeader() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <span className="font-semibold tracking-tight">Lead Distribution Portal — Dashboard</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PublicHeader />
              <main className="container mx-auto px-4 py-8">
                <FormPage />
              </main>
            </>
          }
        />
        <Route
          path="/admin/login"
          element={
            <>
              <PublicHeader />
              <main className="container mx-auto px-4 py-8">
                <LoginPage />
              </main>
            </>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminHeader />
              <main className="container mx-auto px-4 py-8">
                <DashboardPage />
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
