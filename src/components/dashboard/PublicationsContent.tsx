import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaSearch,
  FaEdit,
  FaHeart,
  FaComment,
  FaShare,
  FaTimes,
} from "react-icons/fa";

interface Comment {
  _id: string;
  commenterId: string;
  commenterName: string;
  text: string;
  timestamp: number;
}

interface Creator {
  _id: string;
  fullName?: string;
  email?: string;
  username?: string;
}

interface Post {
  _id: string;
  category:
    | "Birthday"
    | "Marriage"
    | "Baby Shower"
    | "Event"
    | "Noel"
    | "Other";
  reported: boolean;
  caption: string;
  picture: string;
  creator: Creator;
  likers: string[];
  comments: Comment[];
  shares: string[];
  createdAt: string;
}

const PublicationsContent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/post", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Données des publications:", response.data);

        // La réponse est directement un tableau de posts selon votre API
        const postsData = Array.isArray(response.data) ? response.data : [];

        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des publications:",
          error
        );
        setError("Impossible de charger les publications");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrer les publications en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.creator?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          post.creator?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  // Fonction pour confirmer la suppression d'un post
  const confirmDeletePost = (post: Post) => {
    setSelectedPost(post);
    setPostToDelete(post._id);
    setShowConfirmModal(true);
  };

  // Fonction pour afficher le modal d'édition
  const showEditPostModal = (post: Post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/post/${postToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mettre à jour la liste des publications après suppression
      const updatedPosts = posts.filter((post) => post._id !== postToDelete);
      setPosts(updatedPosts);
      setFilteredPosts(
        updatedPosts.filter(
          (post) =>
            post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.creator?.fullName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            post.creator?.email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
      setShowConfirmModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Unable to delete post");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPostToDelete(null);
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
  const getAuthorName = (post: Post) => {
    if (post.creator?.fullName) return post.creator.fullName;
    if (post.creator?.username) return post.creator.username;
    if (post.creator?.email) return post.creator.email;
    return "Utilisateur inconnu";
  };

  // Fonction pour afficher l'image du post
  const renderPostImage = (post: Post) => {
    if (!post.picture) return null;

    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          backgroundImage: `url(${post.picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginRight: "10px",
        }}
      />
    );
  };

  // Fonction pour afficher l'image en grand format
  const showFullImage = (post: Post) => {
    setSelectedPost(post);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(207, 204, 204, 0.1)",
          textAlign: "center",
        }}
      >
        Chargement des publications...
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
        <h2 style={{ marginTop: 0 }}>
          List of publications ({filteredPosts.length})
        </h2>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search for a publication..."
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
              color: "#888",
            }}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p>No publications found</p>
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
                  Category
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Caption
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Creator
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
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <FaComment style={{ color: "#3498db" }} />
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <FaShare style={{ color: "#2ecc71" }} />
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  Date
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
              {filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: getCategoryColor(post.category),
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {post.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {post.picture && renderPostImage(post)}
                      <span>{truncateText(post.caption || "", 50)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px" }}>{getAuthorName(post)}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {post.likers?.length || 0}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {post.comments?.length || 0}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {post.shares?.length || 0}
                  </td>
                  <td
                    style={{ padding: "10px", fontSize: "12px", color: "#666" }}
                  >
                    {formatDate(post.createdAt)}
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
                        title="Modifier"
                        onClick={() => showEditPostModal(post)}
                      >
                        <FaEdit />
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
                        title="Delete"
                        onClick={() => confirmDeletePost(post)}
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

      {/* Modal de confirmation de suppression */}
      {showConfirmModal && selectedPost && (
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
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Confirm deletion</h3>
            <p>Are you sure you want to delete this post?</p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              This action is irreversible.
            </p>

            {/* Affichage de l'image du post */}
            {selectedPost.picture && (
              <div style={{ margin: "15px 0", textAlign: "center" }}>
                <img
                  src={selectedPost.picture}
                  alt="Post image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => showFullImage(selectedPost)}
                />
                <p
                  style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}
                >
                  {truncateText(selectedPost.caption || "", 100)}
                </p>
              </div>
            )}

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
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedPost && (
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
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Edit Post</h3>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
                onClick={closeEditModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* Affichage de l'image du post */}
            {selectedPost.picture && (
              <div style={{ margin: "15px 0", textAlign: "center" }}>
                <img
                  src={selectedPost.picture}
                  alt="Post image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => showFullImage(selectedPost)}
                />
              </div>
            )}

            {/* Formulaire d'édition - à implémenter selon vos besoins */}
            <div style={{ marginTop: "20px" }}>
              <p>Formulaire d'édition à implémenter</p>
            </div>

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
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'affichage d'image en plein écran */}
      {showImageModal && selectedPost && selectedPost.picture && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
          onClick={closeImageModal}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 1101,
            }}
            onClick={closeImageModal}
          >
            <FaTimes />
          </button>
          <img
            src={selectedPost.picture}
            alt="Full size post"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

// Fonction pour obtenir une couleur en fonction de la catégorie
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Birthday":
      return "#eccdd6"; // Rouge
    case "Marriage":
      return "#89adb3"; // Bleu
    case "Baby Shower":
      return "#9b59b6"; // Violet
    case "Event":
      return "#2ecc71"; // Vert
    case "Noel":
      return "#e67e22"; // Orange
    case "Other":
    default:
      return "#7f8c8d"; // Gris
  }
};

export default PublicationsContent;
