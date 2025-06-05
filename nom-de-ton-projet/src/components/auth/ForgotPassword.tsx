import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgotpassword', {
        email
      });

      console.log('Réponse envoi code:', response.data);
      setCodeSent(true);
    } catch (err: any) {
      console.error('Erreur envoi code:', err);
      setError(
        err.response?.data?.message || 
        'Échec de l\'envoi du code. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verifCode', {
        email,
        code: verificationCode
      });

      console.log('Réponse vérification code:', response.data);
      
      if (response.data.permission) {
        setVerificationSuccess(true);
        // Rediriger vers la page de réinitialisation avec l'email en paramètre
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError('Code de vérification incorrect.');
      }
    } catch (err: any) {
      console.error('Erreur vérification code:', err);
      setError(
        err.response?.data?.message || 
        'Échec de la vérification du code. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Mot de passe oublié</h2>
      
      {!codeSent ? (
        <form onSubmit={handleSendCode}>
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
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le code de vérification'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <p className="info-message">
            Un code de vérification a été envoyé à {email}.
          </p>
          
          <div className="form-group">
            <label htmlFor="verificationCode">Code de vérification</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </button>
        </form>
      )}
      
      <div className="auth-links">
        <a href="#" onClick={() => navigate('/login')}>
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}