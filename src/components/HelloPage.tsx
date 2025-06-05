import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './auth/Sidebar';

import { FaBars, FaTimes, FaUsers, FaFileAlt, FaGift } from 'react-icons/fa';
import ContentTypeChart from './auth/ContentTypeChart';

const HelloPage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      width: '100%',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      backgroundColor: '#f5f7fa',
      color: '#333'
    }}>
      {/* Sidebar - avec animation */}
      <div style={{ 
        width: sidebarOpen ? '250px' : '0',
        height: '100%',
        backgroundColor: '#2c3e50',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: '1',
        height: '100%',
        overflowY: 'auto',
        padding: '20px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Navbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px'
            }}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Dashboard
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>{user.email || 'Utilisateur'}</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
        
        {/* Boîtes statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Box 1 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '3px solid #3498db'
          }}>
            <div style={{
              backgroundColor: '#ebf5fb',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <FaUsers style={{ fontSize: '24px', color: '#3498db' }} />
            </div>
            <h3 style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>Utilisateurs</h3>
            <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>9</p>
          </div>
          
          {/* Box 2 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '3px solid #2ecc71'
          }}>
            <div style={{
              backgroundColor: '#eafaf1',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <FaFileAlt style={{ fontSize: '24px', color: '#2ecc71' }} />
            </div>
            <h3 style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>Publications</h3>
            <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>4</p>
          </div>
          
          {/* Box 3 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '3px solid #f39c12'
          }}>
            <div style={{
              backgroundColor: '#fef5e7',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <FaGift style={{ fontSize: '24px', color: '#f39c12' }} />
            </div>
            <h3 style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>Cadeaux</h3>
            <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>8</p>
          </div>
        </div>
        
        {/* Graphique */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '600px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>
            Répartition du contenu
          </h2>
          <div style={{ height: '250px' }}>
         <ContentTypeChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelloPage;

