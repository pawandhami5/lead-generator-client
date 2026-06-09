import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { FormPage } from '@/pages/FormPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

function Header() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold tracking-tight">Lead Portal</span>
          {isAdmin && (
            <nav className="flex gap-4">
              <Link
                to="/"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                Create Lead
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                View Dashboard
              </Link>
            </nav>
          )}
        </div>
        <div>
          {isAdmin ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Sign in as Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
