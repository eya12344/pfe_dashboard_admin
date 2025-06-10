import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaSearch,
  FaEdit,
  FaGift,
  FaHeart,
  FaList,
} from "react-icons/fa";

interface Creator {
  _id: string;
  fullName?: string;
  email?: string;
  username?: string;
}

interface GiftItem {
  name: string;
  description: string;
}

interface Gift {
  _id: string;
  theme: string;
  category:
    | "Birthday"
    | "Marriage"
    | "Baby Shower"
    | "Event"
    | "Noel"
    | "Other";
  gifts: GiftItem[];
  creator: Creator;
  likers: string[];
  createdAt: string;
  updatedAt: string;
}

const GiftsContent: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/gift", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Données des listes de cadeaux:", response.data);

        // La réponse est directement un tableau de listes de cadeaux selon votre API
        const giftsData = Array.isArray(response.data) ? response.data : [];

        setGifts(giftsData);
        setFilteredGifts(giftsData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des listes de cadeaux:",
          error
        );
        setError("Impossible de charger les listes de cadeaux");
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  // Filtrer les listes de cadeaux en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGifts(gifts);
    } else {
      const filtered = gifts.filter(
        (gift) =>
          gift.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gift.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gift.creator?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gift.gifts.some(
            (item) =>
              item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredGifts(filtered);
    }
  }, [searchTerm, gifts]);

  const confirmDeleteGift = (giftId: string) => {
    setGiftToDelete(giftId);
    setShowConfirmModal(true);
  };

  const handleDeleteGift = async () => {
    if (!giftToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/gift/${giftToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mettre à jour la liste des cadeaux après suppression
      const updatedGifts = gifts.filter((gift) => gift._id !== giftToDelete);
      setGifts(updatedGifts);
      setFilteredGifts(updatedGifts);
      setShowConfirmModal(false);
      setGiftToDelete(null);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la liste de cadeaux:",
        error
      );
      alert("Impossible de supprimer la liste de cadeaux");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setGiftToDelete(null);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Fonction pour obtenir le nom de l'auteur
  const getAuthorName = (gift: Gift) => {
    if (gift.creator?.fullName) return gift.creator.fullName;
    if (gift.creator?.username) return gift.creator.username;
    if (gift.creator?.email) return gift.creator.email;
    return "Utilisateur inconnu";
  };

  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Birthday":
        return "#e74c3c"; // Rouge
      case "Marriage":
        return "#eccdd5"; // Bleu
      case "Baby Shower":
        return "#9b59b6"; // Violet
      case "Event":
        return "#89adb3"; // Vert
      case "Noel":
        return "#e67e22"; // Orange
      case "Other":
      default:
        return "#7f8c8d"; // Gris
    }
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
        Chargement des listes de cadeaux...
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
        <h2 style={{ marginTop: 0 }}>List of posts ({filteredGifts.length})</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Serach for a gift..."
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
                color: "white",
              }}
            />
          </div>
        </div>
      </div>

      {filteredGifts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p>Aucune liste de cadeaux trouvée</p>
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
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
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
                  Thème
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Catégorie
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <FaList style={{ color: "#3498db" }} />
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Créateur
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <FaHeart style={{ color: "#e74c3c" }} />
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Créé le
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Mis à jour
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
              {filteredGifts.map((gift) => (
                <tr
                  key={gift._id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={{ padding: "10px", fontWeight: "500" }}>
                    {gift.theme}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: getCategoryColor(gift.category),
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {gift.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {gift.gifts.length}
                  </td>
                  <td style={{ padding: "10px" }}>{getAuthorName(gift)}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {gift.likers?.length || 0}
                  </td>
                  <td
                    style={{ padding: "10px", fontSize: "12px", color: "#666" }}
                  >
                    {formatDate(gift.createdAt)}
                  </td>
                  <td
                    style={{ padding: "10px", fontSize: "12px", color: "#666" }}
                  >
                    {formatDate(gift.updatedAt)}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#3498db",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                        title="Voir les détails"
                      >
                        <FaList />
                      </button>

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
                        onClick={() => confirmDeleteGift(gift._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <h3 style={{ marginTop: 0 }}>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette liste de cadeaux ?</p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Cette action est irréversible.
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
                Annuler
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
                onClick={handleDeleteGift}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftsContent;
