import React from "react";
import { FaHome, FaUser, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import LogoD from "./LogoD.png";

const Sidebar = () => {
  return (
    <div style={{
      height: '100%',
      backgroundColor: '#2c3e50',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0'
    }}>
      {/* Logo et titre */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img
          src={LogoD}
          alt="Logo"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px'
          }}
        />
        <span style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ecf0f1'
        }}>Wishit</span>
      </div>

      {/* Profil utilisateur */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Admin"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid #3498db',
            padding: '2px',
            backgroundColor: 'white'
          }}
        />
        <p style={{
          margin: '10px 0 0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#ecf0f1'
        }}>Salem Menssi</p>
        <span style={{
          fontSize: '12px',
          color: '#bdc3c7'
        }}>Administrateur</span>
      </div>

      {/* Menu de navigation */}
      <nav style={{ flex: 1, padding: '20px 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { icon: <FaHome />, text: "Tableau de bord", active: true },
            { icon: <FaUser />, text: "Utilisateurs" },
            { icon: <FaChartBar />, text: "Statistiques" },
            { icon: <FaCog />, text: "Paramètres" }
          ].map((item, index) => (
            <li key={index} style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: item.active ? '#34495e' : 'transparent',
              borderLeft: item.active ? '4px solid #3498db' : '4px solid transparent',
              transition: 'all 0.2s ease'
            }}>
              <span style={{ 
                marginRight: '10px',
                fontSize: '16px',
                color: item.active ? '#3498db' : '#bdc3c7'
              }}>
                {item.icon}
              </span>
              <span style={{ 
                color: item.active ? '#ecf0f1' : '#bdc3c7',
                fontWeight: item.active ? 'bold' : 'normal'
              }}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }}>
        <FaSignOutAlt style={{ marginRight: '10px', color: '#e74c3c' }} />
        <span style={{ color: '#ecf0f1' }}>Déconnexion</span>
      </div>
    </div>
  );
};

export default Sidebar;
