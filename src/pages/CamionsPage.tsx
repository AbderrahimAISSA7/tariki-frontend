import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Gauge } from "lucide-react";
import { loadDashboardData } from "../services/api";
import type { Camion, DashboardData } from "../types/domain";
import "../styles/list-page.css";

const emptyData: DashboardData = {
  livraisons: [],
  chauffeurs: [],
  camions: [],
  clients: [],
  factures: [],
  signatures: []
};

export function CamionsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Gestion de la Flotte";
    if (subtitleEl) subtitleEl.textContent = "Consultez et gérez votre flotte de véhicules";

    loadDashboardData()
      .then(({ data }) => setData(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>Camions</h2>
        <button className="primary-button" onClick={() => navigate("/camions/new")}>
          <Plus size={19} />
          Ajouter Camion
        </button>
      </div>

      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Capacité (kg)</th>
              <th>Livraisons Actives</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.camions.map((camion) => {
              const livraisonsActives = data.livraisons.filter(
                (l) => l.camionId === camion.id && l.statut !== "LIVREE"
              ).length;

              return (
                <tr key={camion.id}>
                  <td className="immatriculation">{camion.immatriculation}</td>
                  <td>{camion.marque}</td>
                  <td>{camion.modele}</td>
                  <td className="capacity">
                    <Gauge size={16} />
                    {camion.capacite.toLocaleString("fr-MA")}
                  </td>
                  <td className="count">{livraisonsActives}</td>
                  <td>
                    <span className={`status status-${livraisonsActives > 0 ? "en_cours" : "disponible"}`}>
                      {livraisonsActives > 0 ? "En service" : "Disponible"}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="icon-btn" title="Voir détails">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" title="Éditer">
                      <Edit2 size={18} />
                    </button>
                    <button className="icon-btn delete" title="Supprimer">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
