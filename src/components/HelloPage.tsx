import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelloPage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center' 
    }}>
      <h1>Bonjour {user.email || 'Utilisateur'} !</h1>
      <p>Vous êtes maintenant connecté à l'application.</p>
      
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 15px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default HelloPage;