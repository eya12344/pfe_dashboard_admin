import { useState } from 'react'
import './App.css'
import SignIn from './components/auth/SignIn'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  return (
    <div className="App">
      <h1>React + TypeScript</h1>
      {!isAuthenticated ? (
        <SignIn />
      ) : (
        <div>
          <p>Vous êtes connecté!</p>
          <button onClick={() => setIsAuthenticated(false)}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

export default App




