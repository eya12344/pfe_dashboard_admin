import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaFileAlt, FaGift } from "react-icons/fa";
import ContentTypeChart from "../auth/ContentTypeChart";

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  // États pour stocker les données statistiques
  const [userCount, setUserCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [giftCount, setGiftCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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
        const userData =
          usersResponse.data.users && Array.isArray(usersResponse.data.users)
            ? usersResponse.data.users
            : Array.isArray(usersResponse.data)
            ? usersResponse.data
            : [];

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

  // Fonctions de navigation
  const navigateToUsers = () => {
    navigate("/users");
  };

  const navigateToPosts = () => {
    navigate("/publications");
  };

  const navigateToGifts = () => {
    navigate("/gifts");
  };

  return (
    <>
      {/* Boîtes statistiques */}

      {/* Graphiques */}
      <div
        style={{
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          height: "900px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#333" }}>
          Statistics and analytics
        </h2>
        <div style={{ height: "650px" }}>
          <ContentTypeChart />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
