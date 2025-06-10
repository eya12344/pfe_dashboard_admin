import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, PolarArea } from "react-chartjs-2";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

// Interface pour les utilisateurs
interface User {
  _id: string;
  fullName: string;
  email: string;
  sexe?: string; // "Homme" ou "Femme"
  dateDeNaiss?: string; // Date de naissance
  isAdmin?: boolean;
  followers?: string[];
  following?: string[];
  createdAt?: string;
}

// Interface pour les posts
interface Post {
  _id: string;
  caption: string;
  category?: string;
  creator?: any;
  likers?: string[];
  createdAt: string;
}

// Interface pour les gifts
interface Gift {
  _id: string;
  theme: string;
  category?: string;
  creator?: any;
  likers?: string[];
  gifts: any[];
  createdAt: string;
}

// Tranches d'âge pour le graphique
const AGE_RANGES = [
  { min: 0, max: 18, label: "0-18" },
  { min: 19, max: 25, label: "19-25" },
  { min: 26, max: 35, label: "26-35" },
  { min: 36, max: 50, label: "36-50" },
  { min: 51, max: 120, label: "51+" },
];

const ContentTypeChart: React.FC = () => {
  // États pour stocker les données
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // États pour les statistiques par genre
  const [hommeCount, setHommeCount] = useState(0);
  const [femmeCount, setFemmeCount] = useState(0);
  const [nonSpecifieCount, setNonSpecifieCount] = useState(0);

  // État pour les statistiques par âge
  const [ageGroups, setAgeGroups] = useState<number[]>(
    Array(AGE_RANGES.length).fill(0)
  );

  // État pour les statistiques par mois
  const [postsByMonth, setPostsByMonth] = useState<number[]>(Array(6).fill(0));
  const [giftsByMonth, setGiftsByMonth] = useState<number[]>(Array(6).fill(0));

  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Fonction pour compter les éléments par mois (6 derniers mois)
  const countItemsByMonth = (items: any[]): number[] => {
    const counts = Array(6).fill(0);
    const today = new Date();

    items.forEach((item) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const monthDiff =
          (today.getFullYear() - itemDate.getFullYear()) * 12 +
          (today.getMonth() - itemDate.getMonth());

        // Si l'élément a été créé dans les 6 derniers mois
        if (monthDiff >= 0 && monthDiff < 6) {
          counts[5 - monthDiff]++;
        }
      }
    });

    return counts;
  };

  // Récupérer les données depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Récupérer les utilisateurs
        const usersResponse = await axios.get(
          "http://localhost:4000/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Récupérer les posts
        const postsResponse = await axios.get(
          "http://localhost:4000/api/post",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Récupérer les gifts
        const giftsResponse = await axios.get(
          "http://localhost:4000/api/gift",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Extraire les données
        const userData = usersResponse.data.data || [];
        const postData = Array.isArray(postsResponse.data) ? postsResponse.data : [];
        const giftData = Array.isArray(giftsResponse.data) ? giftsResponse.data : [];

        setUsers(userData);
        setPosts(postData);
        setGifts(giftData);

        // Calculer les statistiques par genre
        let hommes = 0;
        let femmes = 0;
        let nonSpecifie = 0;

        // Initialiser les compteurs d'âge
        const ageCount = Array(AGE_RANGES.length).fill(0);

        userData.forEach((user: User) => {
          // Compter par genre
          if (user.sexe === "Homme") {
            hommes++;
          } else if (user.sexe === "Femme") {
            femmes++;
          } else {
            nonSpecifie++;
          }

          // Compter par tranche d'âge si la date de naissance est disponible
          if (user.dateDeNaiss) {
            const age = calculateAge(user.dateDeNaiss);

            // Trouver la tranche d'âge correspondante
            for (let i = 0; i < AGE_RANGES.length; i++) {
              if (age >= AGE_RANGES[i].min && age <= AGE_RANGES[i].max) {
                ageCount[i]++;
                break;
              }
            }
          }
        });

        setHommeCount(hommes);
        setFemmeCount(femmes);
        setNonSpecifieCount(nonSpecifie);
        setAgeGroups(ageCount);

        // Calculer les statistiques par mois
        setPostsByMonth(countItemsByMonth(postData));
        setGiftsByMonth(countItemsByMonth(giftData));
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données pour les graphiques:",
          error
        );
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Données pour le graphique en camembert avec les données réelles
  const pieData = {
    labels: ["Gifts", "Posts", "Users"],
    datasets: [
      {
        data: [gifts.length, posts.length, users.length],
        backgroundColor: ["#ECCDD5", "#D4D2E2", "#E7EAE9"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  // Obtenir les noms des 6 derniers mois
  const getLastSixMonths = (): string[] => {
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const today = new Date();
    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (today.getMonth() - i + 12) % 12;
      lastSixMonths.push(months[monthIndex]);
    }

    return lastSixMonths;
  };

  // Données pour le graphique en barres avec les données réelles
  const barData = {
    labels: getLastSixMonths(),
    datasets: [
      {
        label: "Gifts",
        data: giftsByMonth,
        backgroundColor: "#ECCDD5",
      },
      {
        label: "Posts",
        data: postsByMonth,
        backgroundColor: "#D4D2E2",
      },
    ],
  };

  // Données pour le graphique par genre - utilisant les données du backend
  const genderData = {
    labels: ["Male", "Female", "Non spécifié"],
    datasets: [
      {
        data: [hommeCount, femmeCount, nonSpecifieCount],
        backgroundColor: [
          "#89ADB3", 
          "#ECCDD5", 
          "#D4D2E2", 
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique par âge - utilisant les données du backend
  const ageData = {
    labels: AGE_RANGES.map((range) => range.label),
    datasets: [
      {
        label: "Users by age ",
        data: ageGroups,
        backgroundColor: [
          "#FF9F40", // orange
          "#36A2EB", // bleu
          "#FFCD56", // jaune
          "#4BC0C0", // turquoise
          "#9966FF", // violet
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options pour les graphiques avec maintainAspectRatio: true
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Content by type",
        font: {
          size: 16,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Évolution sur 6 mois",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const genderOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Users by gender",
        font: {
          size: 16,
        },
      },
    },
  };

  const ageOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Users by age",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Statistiques par genre
  const totalUsers = hommeCount + femmeCount; // Sans compter "Non spécifié"
  const hommePercent =
    totalUsers > 0 ? Math.round((hommeCount / totalUsers) * 100) : 0;
  const femmePercent =
    totalUsers > 0 ? Math.round((femmeCount / totalUsers) * 100) : 0;

  // Style commun pour les boîtes de graphiques avec hauteur moyenne
  const chartBoxStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    height: "300px", // Hauteur moyenne pour chaque boîte
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 300px)", // Hauteur moyenne pour les rangées
        gap: "20px",
        height: "100%",
      }}
    >
      {/* Boîte 1: Graphique en camembert */}
      <div style={chartBoxStyle}>
        <h3
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}
        >
         Distribution of elements
        </h3>
        <div style={{ height: "250px" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Boîte 2: Graphique en barres */}
      <div style={chartBoxStyle}>
        <h3
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}
        >
         Evolution over 6 months
        </h3>
        <div style={{ height: "250px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Boîte 3: Graphique par genre */}
      <div style={chartBoxStyle}>
        <h3
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Users by gender
        </h3>
        <div style={{ height: "250px" }}>
          <Pie data={genderData} options={genderOptions} />
        </div>
      </div>

      {/* Boîte 4: Graphique par âge */}
      <div style={chartBoxStyle}>
        <h3
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Users by age
        </h3>
        <div style={{ height: "250px" }}>
          <Bar data={ageData} options={ageOptions} />
        </div>
      </div>
    </div>
  );
};

export default ContentTypeChart;

