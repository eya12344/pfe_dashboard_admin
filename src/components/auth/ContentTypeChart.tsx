import React from "react";
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

const ContentTypeChart: React.FC = () => {
  // Données pour le graphique en camembert
  const pieData = {
    labels: ["Cadeaux", "Publications", "Utilisateurs"],
    datasets: [
      {
        data: [8, 4, 9],
        backgroundColor: [
          "#ECCDD5", // orange pour cadeaux
          "#D4D2E2", // vert pour publications
          "#E7EAE9", // bleu pour utilisateurs
        ],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  // Données pour le graphique en barres
  const barData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        label: "Cadeaux",
        data: [2, 3, 1, 4, 5, 8],
        backgroundColor: "#ECCDD5",
      },
      {
        label: "Publications",
        data: [1, 2, 1, 3, 2, 4],
        backgroundColor: "#D4D2E2",
      },
    ],
  };

  // Données pour le graphique par genre
  const genderData = {
    labels: ["Hommes", "Femmes", "Non spécifié"],
    datasets: [
      {
        data: [5, 3, 1],
        backgroundColor: [
          "#89ADB3", // bleu pour hommes
          "#ECCDD5", // rose pour femmes
          "#D4D2E2", // gris pour non spécifié
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique de répartition par genre en pourcentage
  const genderPercentData = {
    labels: ["Hommes", "Femmes"],
    datasets: [
      {
        label: "Pourcentage",
        data: [62.5, 37.5], // 5/8 = 62.5%, 3/8 = 37.5% (sans compter "Non spécifié")
        backgroundColor: ["#3498db", "#e84393"],
        borderColor: ["#2980b9", "#d63031"],
        borderWidth: 1,
      },
    ],
  };

  // Options pour les graphiques
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Répartition des éléments",
        font: {
          size: 14,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Évolution sur 6 mois",
        font: {
          size: 14,
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Répartition par genre",
        font: {
          size: 14,
        },
      },
    },
  };

  const genderPercentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pourcentage par genre",
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
        },
      },
    },
  };

  // Statistiques par genre
  const totalUsers = 8; // 5 hommes + 3 femmes (sans compter "Non spécifié")
  const malePercent = Math.round((5 / totalUsers) * 100);
  const femalePercent = Math.round((3 / totalUsers) * 100);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", flex: 1, gap: "20px" }}>
        <div style={{ flex: 1, height: "100%" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "200px",
          marginTop: "20px",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1, height: "100%" }}>
          <PolarArea data={genderData} options={genderOptions} />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <h2
              style={{
                fontSize: "16px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Statistiques par genre
            </h2>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              {/* Barre de progression pour les hommes */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Hommes
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#3498db",
                    }}
                  >
                    {malePercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: "10px",
                    backgroundColor: "#ecf0f1",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${malePercent}%`,
                      height: "100%",
                      backgroundColor: "#3498db",
                      borderRadius: "5px",
                    }}
                  ></div>
                </div>
              </div>

              {/* Barre de progression pour les femmes */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    Femmes
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#e84393",
                    }}
                  >
                    {femalePercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: "10px",
                    backgroundColor: "#ecf0f1",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${femalePercent}%`,
                      height: "100%",
                      backgroundColor: "#e84393",
                      borderRadius: "5px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTypeChart;
