import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaSearch } from "react-icons/fa";

interface User {
  _id: string;
  fullName: string;
  email: string;
  isAdmin?: boolean;
  followers?: string[];
  following?: string[];
}

interface ApiResponse {
  success: boolean;
  data: User[];
  message?: string;
}

const UsersContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<ApiResponse>(
          "http://localhost:4000/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Données utilisateurs:", response.data);

        // Adapter la structure de la réponse à notre modèle
        const userData = response.data.data || [];
        
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
        setError("Impossible de charger les utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowConfirmModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/user/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mettre à jour la liste des utilisateurs après suppression
      const updatedUsers = users.filter((user) => user._id !== userToDelete);
      setUsers(updatedUsers);
      setFilteredUsers(
        updatedUsers.filter(
          (user) =>
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      alert("Impossible de supprimer l'utilisateur");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        Chargement des utilisateurs...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>User List</h2>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px 8px 35px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              width: "250px",
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p>No users found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                padding: "8px 15px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Full name
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Followers
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Following
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: "10px" }}>
                  {user.fullName || "Sans nom"}
                </td>
                <td style={{ padding: "10px" }}>{user.email}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {user.followers?.length || 0}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {user.following?.length || 0}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                    title="Supprimer"
                    onClick={() => confirmDeleteUser(user._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Confirm deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              This action is irreversible.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#f1f1f1",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersContent;

