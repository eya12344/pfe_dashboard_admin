import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './components/auth/SignIn';
//import SignUp from './components/auth/SignUp';
//import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
//import ForgotPassword from './components/auth/ForgotPassword';
//import ResetPassword from './components/auth/ResetPassword';

// Composant pour les routes protégées
const ProtectedRoute = ({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly) {
    try {
      const user = JSON.parse(userStr);
      if (!user.isAdmin) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsAuthenticated(true);
      
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error);
      }
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <div className="App">
      <Routes>
        {/* Routes publiques */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace /> : 
              <SignIn onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace /> : 
              <SignUp onSignUpSuccess={handleLoginSuccess} switchToSignIn={() => {}} />
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        {/* Routes admin */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirection par défaut */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
              <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;