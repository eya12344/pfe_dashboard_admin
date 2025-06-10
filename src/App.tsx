import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import UsersContent from "./components/dashboard/UsersContent";
import UserLocationsTable from "./components/dashboard/DashboardHome";
import PublicationsContent from "./components/dashboard/PublicationsContent";
import GiftsContent from "./components/dashboard/GiftsContent";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);

    // Vérifier si l'utilisateur est admin après connexion
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error(
          "Erreur lors de la lecture des données utilisateur:",
          error
        );
      }
    }
  };

  return (
    <div className="App">
      <Routes>
        {/* Routes d'authentification */}
        <Route
          path="/login"
          element={<SignIn onLoginSuccess={handleLoginSuccess} />}
        />
        
        {/* Routes du dashboard avec layout partagé */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/hello" replace />} />
          <Route path="hello" element={<DashboardHome />} />
          <Route path="users" element={<UsersContent />} />
          <Route path="user-locations" element={<UserLocationsTable />} /> {/* Nouvelle route */}
          <Route path="publications" element={<PublicationsContent />} />
          <Route path="gifts" element={<GiftsContent />} />
          <Route path="stats" element={<DashboardHome />} /> {/* Placeholder */}
          <Route path="settings" element={<DashboardHome />} /> {/* Placeholder */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;


