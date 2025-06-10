import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../auth/Sidebar";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaFileAlt,
  FaGift,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userCount, setUserCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [giftCount, setGiftCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation functions
  const navigateToUsers = () => navigate("/users");
  const navigateToPosts = () => navigate("/publications");
  const navigateToGifts = () => navigate("/gifts");

  // Vérifier si nous sommes sur la page dashboard principale
  const isDashboardHome = location.pathname === "/hello";

  // Récupérer les données statistiques au chargement du composant
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Récupérer le nombre d'utilisateurs
        const usersResponse = await axios.get(
          "http://localhost:4000/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Récupérer le nombre de publications
        const postsResponse = await axios.get(
          "http://localhost:4000/api/post",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Récupérer le nombre de cadeaux
        const giftsResponse = await axios.get(
          "http://localhost:4000/api/gift",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Extraire les données et mettre à jour les états
        const userData = usersResponse.data.data;

        const postData =
          postsResponse.data.posts && Array.isArray(postsResponse.data.posts)
            ? postsResponse.data.posts
            : Array.isArray(postsResponse.data)
            ? postsResponse.data
            : [];

        const giftData =
          giftsResponse.data.gifts && Array.isArray(giftsResponse.data.gifts)
            ? giftsResponse.data.gifts
            : Array.isArray(giftsResponse.data)
            ? giftsResponse.data
            : [];

        setUserCount(userData.length);
        setPostCount(postData.length);
        setGiftCount(giftData.length);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        margin: "0",
        padding: "0",
        overflow: "hidden",
        backgroundColor: "#f5f7fa",
        color: "#333",
      }}
    >
      {/* Sidebar Left - avec animation */}
      <div
        style={{
          width: sidebarOpen ? "140px" : "0px",
          height: "100%",
          transition: "width 0.3s ease",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: "1",
          height: "100%",
          overflowY: "auto",
          padding: "20px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Dashboard
          </div>
        </div>

        {/* Boîtes de statistiques - uniquement sur la page dashboard principale */}
        {isDashboardHome && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Box statistiques utilisateurs */}
            <div
              onClick={navigateToUsers}
              style={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderTop: "3px solid #3498db",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#e6f2fa",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <FaUsers style={{ fontSize: "20px", color: "#3498db" }} />
                </div>
                <h3 style={{ fontSize: "16px", margin: 0 }}>USERS</h3>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {loading ? "..." : userCount}
              </div>
            </div>

            {/* Box statistiques publications */}
            <div
              onClick={navigateToPosts}
              style={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderTop: "3px solid #e74c3c",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fae5e5",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <FaFileAlt style={{ fontSize: "20px", color: "#e74c3c" }} />
                </div>
                <h3 style={{ fontSize: "16px", margin: 0 }}>POSTS</h3>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {loading ? "..." : postCount}
              </div>
            </div>

            {/* Box statistiques cadeaux */}
            <div
              onClick={navigateToGifts}
              style={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderTop: "3px solid #f39c12",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fef5e7",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                  }}
                >
                  <FaGift style={{ fontSize: "20px", color: "#f39c12" }} />
                </div>
                <h3 style={{ fontSize: "16px", margin: 0 }}>GIFTS</h3>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {loading ? "..." : giftCount}
              </div>
            </div>
          </div>
        )}

        {/* Contenu dynamique - sera remplacé par les composants de route */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
