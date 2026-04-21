import React from 'react'
import ReactDOM from 'react-dom/client'
import { AsgardeoProvider } from '@asgardeo/react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AsgardeoProvider
      clientId={import.meta.env.VITE_ASGARDEO_CLIENT_ID}
      baseUrl={import.meta.env.VITE_ASGARDEO_BASE_URL}
      afterSignInUrl={import.meta.env.VITE_ASGARDEO_SIGN_IN_REDIRECT_URL}
      afterSignOutUrl={import.meta.env.VITE_ASGARDEO_SIGN_OUT_REDIRECT_URL}
      scopes={['openid', 'profile', 'email']}
    >
      <App />
    </AsgardeoProvider>
  </React.StrictMode>,
)