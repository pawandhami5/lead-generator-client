import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { FormPage } from '@/pages/FormPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { cn } from '@/lib/utils'

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  return (
    <Link
      to={to}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        location.pathname === to
          ? 'text-primary'
          : 'text-muted-foreground',
      )}
    >
      {label}
    </Link>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
          <span className="font-semibold tracking-tight">Lead Portal</span>
          <nav className="flex gap-6">
            <NavLink to="/" label="Submit Lead" />
            <NavLink to="/dashboard" label="Dashboard" />
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
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
