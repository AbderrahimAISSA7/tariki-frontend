import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { loadDashboardData } from "../services/api";
import type { Livraison, DashboardData } from "../types/domain";
import "../styles/list-page.css";

const statusLabels: Record<string, string> = {
  EN_COURS: "En route",
  LIVREE: "Livre",
  DEMARRE: "Demarre",
  ANNULEE: "Annule"
};

const emptyData: DashboardData = {
  livraisons: [],
  chauffeurs: [],
  camions: [],
  clients: [],
  factures: [],
  signatures: []
};

export function LivraisonsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Gestion des Livraisons";
    if (subtitleEl) subtitleEl.textContent = "Consultez et gérez toutes vos livraisons";

    loadDashboardData()
      .then(({ data }) => setData(data))
      .finally(() => setIsLoading(false));
  }, []);

  const findChauffeur = (id: number) => data.chauffeurs.find((c) => c.id === id);
  const findCamion = (id: number) => data.camions.find((c) => c.id === id);
  const findClient = (id: number) => data.clients.find((c) => c.id === id);

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>Livraisons</h2>
        <button className="primary-button" onClick={() => navigate("/livraisons/new")}>
          <Plus size={19} />
          Nouvelle Livraison
        </button>
      </div>

      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Chauffeur</th>
              <th>Camion</th>
              <th>Destination</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.livraisons.map((livraison) => {
              const chauffeur = findChauffeur(livraison.chauffeurId);
              const camion = findCamion(livraison.camionId);
              const client = findClient(livraison.clientId);

              return (
                <tr key={livraison.id}>
                  <td className="reference">{livraison.reference}</td>
                  <td>{client?.nom ?? "Inconnu"}</td>
                  <td>{chauffeur ? `${chauffeur.prenom} ${chauffeur.nom}` : "Non assigné"}</td>
                  <td>{camion ? `${camion.marque} ${camion.modele}` : "Non assigné"}</td>
                  <td className="destination">{client?.adresse ?? "-"}</td>
                  <td>
                    <span className={`status status-${livraison.statut.toLowerCase()}`}>
                      {statusLabels[livraison.statut] ?? livraison.statut}
                    </span>
                  </td>
                  <td>{new Intl.DateTimeFormat("fr-FR").format(new Date(livraison.dateLivraison))}</td>
                  <td className="actions">
                    <button className="icon-btn" title="Voir">
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
