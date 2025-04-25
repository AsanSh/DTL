import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { RequestProvider, useRequests } from './context/RequestContext'
import { Navigation } from './components/Navigation'
import { Requests } from './pages/Requests'
import { Closed } from './pages/Closed'
import { Analytics } from './pages/Analytics'
import { UserManagement } from './pages/UserManagement'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

// Компоненты маршрутизации
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useRequests()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useRequests()
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useRequests()
  if (currentUser) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

// Основные маршруты приложения
const AppRoutes: React.FC = () => {
  return (
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
  )
}

// Корневой компонент приложения
const App: React.FC = () => {
  return (
    <RequestProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </RequestProvider>
  )
}

export default App 