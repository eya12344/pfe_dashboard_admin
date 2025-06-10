import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import LogoD from "./LogoD.png";
interface SignInProps {
  onLoginSuccess: () => void;
}

export default function SignIn({ onLoginSuccess }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Vérification des champs avant envoi
      if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }

      console.log("Tentative de connexion avec:", { email, password });

      const response = await axios.post(
        "http://localhost:4000/api/auth/signin",
        {
          email,
          password,
        }
      );

      console.log("Réponse du serveur:", response.data);

      if (response.data.success) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("Connexion réussie, utilisateur:", response.data.user);

        // Informer le parent de la connexion réussie
        onLoginSuccess();

        // Redirection selon le type d'utilisateur
        if (response.data.user.isAdmin) {
          navigate("/hello");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Échec de la connexion. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error("Erreur complète:", err);

      if (err.response) {
        console.error("Détails de l'erreur:", {
          status: err.response.status,
          data: err.response.data,
        });

        // Messages d'erreur spécifiques selon le code d'erreur
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (err.response.status === 404) {
          setError("Utilisateur non trouvé");
        } else {
          setError(
            err.response.data.message ||
              "Erreur lors de la connexion. Veuillez réessayer."
          );
        }
      } else if (err.request) {
        // La requête a été envoyée mais pas de réponse
        console.error("Pas de réponse du serveur:", err.request);
        setError(
          "Le serveur ne répond pas. Vérifiez votre connexion internet."
        );
      } else {
        // Erreur lors de la configuration de la requête
        console.error("Erreur de requête:", err.message);
        setError("Erreur lors de la connexion: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      {/* Colonne gauche - formulaire */}
      <div className="signin-left">
        <div className="form-box">
          <h2 className="form-box-h2">Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <button type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>

            <div
              style={{
                marginTop: "15px",
                textAlign: "center",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <p>Cette application est réservée aux administrateurs.</p>
            </div>
          </form>
        </div>
      </div>

      {/* Colonne droite - visuel Wishit */}
      <div className="signin-right">
        <img src={LogoD} alt="logo" className="ribbon" />
        <h1 className="logo-text">Wishit</h1>
      </div>
    </div>
  );
}
