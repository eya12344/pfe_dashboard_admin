import {
  FaHome,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaGift,
  FaFileAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import LogoD from "./LogoD.png";

const Sidebar = () => {
  const location = useLocation();
  
  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(to bottom, #ECCDD5, #D4D2E2)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
      }}
    >
      {/* Logo et titre */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src={LogoD}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <span
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ecf0f1",
          }}
        >
          Wishit
        </span>
      </div>

      {/* Profil utilisateur */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Admin"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "2px solid #3498db",
            padding: "2px",
            backgroundColor: "white",
          }}
        />
        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ecf0f1",
          }}
        >
          Salem Menssi
        </p>
        <span
          style={{
            fontSize: "12px",
            color: "#bdc3c7",
          }}
        >
          Administrateur
        </span>
      </div>

      {/* Menu de navigation */}
      <nav style={{ flex: 1, padding: "20px 0" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            { icon: <FaHome />, text: "Tableau de bord", path: "/hello" },
            { icon: <FaUsers />, text: "Utilisateurs", path: "/users" },
            { icon: <FaFileAlt />, text: "Publications", path: "/publications" },
            { icon: <FaGift />, text: "Cadeaux", path: "/gifts" },
            { icon: <FaChartBar />, text: "Statistiques", path: "/stats" },
            { icon: <FaCog />, text: "Paramètres", path: "/settings" },
          ].map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={index}
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? "rgba(236, 205, 213, 0.3)"
                    : "transparent",
                  borderLeft: isActive
                    ? "4px solid #3498db"
                    : "4px solid transparent",
                  transition: "all 0.2s ease",
                  marginBottom: "5px",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      marginRight: "10px",
                      fontSize: "16px",
                      color: isActive ? "#3498db" : "#ecf0f1",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      color: isActive ? "#3498db" : "#ecf0f1",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {item.text}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div
        onClick={handleLogout}
        style={{
          padding: "25px 25px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <FaSignOutAlt style={{ marginRight: "10px", color: "#3498db" }} />
        <span style={{ color: "#ecf0f1" }}>Déconnexion</span>
      </div>
    </div>
  );
};

export default Sidebar;
