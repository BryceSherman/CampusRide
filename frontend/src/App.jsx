import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'

function HomePage() {
  const { state, signIn, signOut } = useAuthContext()

  return (
    <div className="text-center pt-10">
      <h1>Welcome to CampusRide</h1>

      {!state?.isAuthenticated ? (
        <>
          <p>Please sign in to continue.</p>
          <button
            onClick={() => signIn()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          <p>You are signed in.</p>
          <button
            onClick={() => signOut()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App