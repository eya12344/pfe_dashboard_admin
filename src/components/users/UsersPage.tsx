import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../auth/Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const UsersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Fonction pour récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Données utilisateurs:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      width: '100%',
      backgroundColor: '#f5f7fa'
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: sidebarOpen ? '250px' : '0',
        height: '100%',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: '1',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '18px',
            marginLeft: '15px'
          }}>
            Gestion des Utilisateurs
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <p >Chargement des utilisateurs...</p>
          ) : (
            <div>
              <h2>Liste des utilisateurs</h2>
              <p>Contenu de la page utilisateurs</p>
              {/* Vous pouvez ajouter votre tableau d'utilisateurs ici */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;



