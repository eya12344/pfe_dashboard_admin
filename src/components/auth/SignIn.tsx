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
      const response = await axios.post(
        "http://localhost:4000/api/auth/signin",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        onLoginSuccess();
        navigate("/hello");
      } else {
        setError("Échec de la connexion. Veuillez réessayer.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Échec de la connexion. Veuillez vérifier vos identifiants."
      );
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
