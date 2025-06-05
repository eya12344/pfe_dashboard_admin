import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import HelloPage from './components/HelloPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    
    // Vérifier si l'utilisateur est admin après connexion
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error);
      }
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="/" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </div>
  );
}

export default App;





