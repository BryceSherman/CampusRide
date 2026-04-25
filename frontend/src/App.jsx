import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import { RideProvider } from './context/RideContext'
import Navbar from './components/Navbar'
import LoginRedirect from './pages/LoginRedirect'
import RoleSelector from './pages/RoleSelector'
import RiderDashboard from './pages/RiderDashboard'
import DriverDashboard from './pages/DriverDashboard'

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginRedirect />} />
        
        {/* Role Selection */}
        <Route
          path="/select-role"
          element={
            <ProtectedRoute>
              <RoleSelector />
            </ProtectedRoute>
          }
        />
        
        {/* Rider Routes */}
        <Route
          path="/rider/dashboard"
          element={
            <ProtectedRoute requiredRole="rider">
              <RiderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute requiredRole="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <RideProvider>
          <AppContent />
        </RideProvider>
      </AuthProvider>
    </Router>
  )
}

export default App