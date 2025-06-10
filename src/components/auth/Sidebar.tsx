import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaGift,
  FaSignOutAlt,
  FaCog,
  FaChartBar
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

interface User {
  _id: string;
  fullName?: string;
  email: string;
  isAdmin?: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.fullName) {
      const parts = user.fullName.split(" ");
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : user.fullName[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const menuItems = [
    { icon: <FaHome />, path: "/hello" },
    { icon: <FaUsers />, path: "/users" },
    { icon: <FaFileAlt />, path: "/publications" },
    { icon: <FaGift />, path: "/gifts" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100px",
        backgroundColor: "#fff",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0",
        marginLeft: "20px",
        marginRight: "20px",
        position: "relative",
      }}
    >
      {/* Avatar en haut */}
      <div style={{ marginBottom: "20px" }}>
        {user?.fullName ? (
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.fullName
            )}&background=0D8ABC&color=fff&size=60`}
            alt="avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#ECCDD5",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {getUserInitials()}
          </div>
        )}
      </div>

      {/* Icônes centrées verticalement */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: "40px",
        }}
      >
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              style={{
                color: isActive ? "#ECCDD5" : "#888",
                fontSize: "18px",
              }}
            >
              {item.icon}
            </Link>
          );
        })}
      </div>

      {/* Bouton logout en bas */}
      <div
        onClick={handleLogout}
        style={{
          cursor: "pointer",
          padding: "10px 0",
          color: "#888",
        }}
      >
        <FaSignOutAlt size={18} />
      </div>
    </div>
  );
};

export default Sidebar;
