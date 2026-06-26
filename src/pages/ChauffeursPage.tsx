import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Phone, Mail } from "lucide-react";
import { loadDashboardData } from "../services/api";
import type { Chauffeur, DashboardData } from "../types/domain";
import "../styles/list-page.css";

const emptyData: DashboardData = {
  livraisons: [],
  chauffeurs: [],
  camions: [],
  clients: [],
  factures: [],
  signatures: []
};

export function ChauffeursPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Gestion des Chauffeurs";
    if (subtitleEl) subtitleEl.textContent = "Consultez et gérez votre équipe de chauffeurs";

    loadDashboardData()
      .then(({ data }) => setData(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>Chauffeurs</h2>
        <button className="primary-button" onClick={() => navigate("/chauffeurs/new")}>
          <Plus size={19} />
          Ajouter Chauffeur
        </button>
      </div>

      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Livraisons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.chauffeurs.map((chauffeur) => {
              const livraisonsCount = data.livraisons.filter((l) => l.chauffeurId === chauffeur.id).length;

              return (
                <tr key={chauffeur.id}>
                  <td className="name">{chauffeur.nom}</td>
                  <td>{chauffeur.prenom}</td>
                  <td>
                    <a href={`mailto:${chauffeur.email}`} className="email-link">
                      <Mail size={16} />
                      {chauffeur.email}
                    </a>
                  </td>
                  <td>
                    <a href={`tel:${chauffeur.telephone}`} className="phone-link">
                      <Phone size={16} />
                      {chauffeur.telephone}
                    </a>
                  </td>
                  <td className="count">{livraisonsCount}</td>
                  <td className="actions">
                    <button className="icon-btn" title="Voir profil">
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
