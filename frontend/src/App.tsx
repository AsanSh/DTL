import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { RequestProvider } from './context/RequestContext'
import { Navigation } from './components/Navigation'
import { Requests } from './pages/Requests'
import { Closed } from './pages/Closed'
import { Analytics } from './pages/Analytics'
import { UserManagement } from './pages/UserManagement'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { useRequests } from './context/RequestContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useRequests()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin } = useRequests()
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useRequests()
  if (currentUser) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

const App = () => {
  return (
    <RequestProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Requests />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/closed"
              element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <Closed />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <AdminRoute>
                  <>
                    <Navigation />
                    <Analytics />
                  </>
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <>
                    <Navigation />
                    <UserManagement />
                  </>
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </RequestProvider>
  )
}

export default App 