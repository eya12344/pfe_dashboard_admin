import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations utilisateur du localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      
      // Vérifier si l'utilisateur est un administrateur
      if (!userData.isAdmin) {
        console.log('Accès non autorisé: utilisateur non admin');
        navigate('/dashboard');
        return;
      }
      
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Tableau de bord administrateur</h1>
        <div className="admin-user-info">
          <span>{user.fullName || user.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <ul>
            <li className="active">Tableau de bord</li>
            <li>Utilisateurs</li>
            <li>Contenu</li>
            <li>Paramètres</li>
          </ul>
        </div>
        
        <main className="admin-main">
          <div className="admin-card">
            <h2>Bienvenue, {user.fullName || 'Administrateur'}</h2>
            <p>Vous êtes connecté en tant qu'administrateur.</p>
            <p>Email: {user.email}</p>
            <p>ID: {user._id}</p>
            <p>Date d'inscription: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Utilisateurs</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Posts</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>Cadeaux</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}