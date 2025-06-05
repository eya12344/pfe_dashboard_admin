import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

interface SignInProps {
  onLoginSuccess: () => void;
}

export default function SignIn({ onLoginSuccess }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à l'API de connexion
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password
      });

      console.log('Réponse de connexion:', response.data);

      if (response.data.success) {
        // Stocker le token dans localStorage
        localStorage.setItem('token', response.data.token);
        
        // Stocker les informations utilisateur
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Vérifier si l'utilisateur est un administrateur
        if (response.data.user.isAdmin) {
          console.log('Utilisateur admin connecté');
          navigate('/admin-dashboard');
        } else {
          console.log('Utilisateur standard connecté');
          navigate('/dashboard');
        }
        
        // Informer le parent que la connexion est réussie
        onLoginSuccess();
      } else {
        setError('Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      
      // Afficher le message d'erreur de l'API si disponible
      setError(
        err.response?.data?.message || 
        'Échec de la connexion. Veuillez vérifier vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>Connexion</h2>
      
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
        
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      
      <div className="auth-links">
        <a href="#" onClick={() => navigate('/forgot-password')}>
          Mot de passe oublié ?
        </a>
        <a href="#" onClick={() => navigate('/signup')}>
          Créer un compte
        </a>
      </div>
    </div>
  );
}