import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  Truck
} from "lucide-react";
import { loadDashboardData } from "../services/api";
import type { DashboardData, DeliveryStatus } from "../types/domain";
import "../styles/dashboard.css";

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

function formatMAD(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0
  }).format(value);
}

function normalizeStatus(status: DeliveryStatus) {
  return statusLabels[status] ?? status.split("_").join(" ");
}

interface MetricCardProps {
  title: string;
  value: number | string;
  detail: string;
  trend?: string;
  icon: typeof Truck;
}

function MetricCard({ title, value, detail, trend, icon: Icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <h2>{title}</h2>
      <div className="metric-body">
        <span className="metric-icon">
          <Icon size={28} />
        </span>
        <div>
          <strong>{value}</strong>
          <p>{detail}</p>
        </div>
        {trend && <span className="trend">{trend}</span>}
      </div>
    </article>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyData);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("ALL");

  useEffect(() => {
    loadDashboardData()
      .then(({ data, isFallback: fallback }) => {
        setDashboardData(data);
        setIsFallback(fallback);
      })
      .finally(() => setIsLoading(false));

    // Update page title in header
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const displayName = user ? `${user.prenom ?? ""} ${user.nom ?? ""}`.trim() : "Tariki Admin";
    if (titleEl) titleEl.textContent = "Tableau de Bord Global";
    if (subtitleEl) subtitleEl.textContent = `Bienvenue, ${displayName}!`;
  }, []);

  const totals = useMemo(() => {
    const activeDeliveries = dashboardData.livraisons.filter((delivery) => delivery.statut !== "LIVREE").length;
    const completedDeliveries = dashboardData.livraisons.filter((delivery) => delivery.statut === "LIVREE").length;
    const revenue = dashboardData.factures.reduce((sum, invoice) => sum + Number(invoice.montantTTC), 0);
    const usedTrucks = new Set(dashboardData.livraisons.map((delivery) => delivery.camionId)).size;

    return {
      activeDeliveries,
      completedDeliveries,
      revenue,
      usedTrucks,
      trucks: dashboardData.camions.length
    };
  }, [dashboardData]);

  const filteredDeliveries = useMemo(() => {
    if (activeStatus === "ALL") {
      return dashboardData.livraisons;
    }
    return dashboardData.livraisons.filter((delivery) => delivery.statut === activeStatus);
  }, [activeStatus, dashboardData.livraisons]);

  const findChauffeur = (id: number) => dashboardData.chauffeurs.find((chauffeur) => chauffeur.id === id);
  const findCamion = (id: number) => dashboardData.camions.find((camion) => camion.id === id);
  const findClient = (id: number) => dashboardData.clients.find((client) => client.id === id);

  return (
    <section className="page-content">
      <section className="toolbar" aria-label="Recherche">
        <label className="search-field">
          <Search size={24} />
          <input type="search" placeholder="Rechercher livraisons, chauffeurs, camions..." />
        </label>
        {isFallback && <span className="data-pill">Mode demo</span>}
      </section>

      <section className="metrics-grid" aria-label="Indicateurs principaux">
        <MetricCard title="Livraisons en Cours" value={totals.activeDeliveries} detail="Active" trend="+12.5%" icon={Truck} />
        <MetricCard title="Livraisons Terminees" value={totals.completedDeliveries} detail="Aujourd'hui" icon={PackageCheck} />
        <MetricCard title="Flotte Assignee" value={`${totals.usedTrucks} / ${totals.trucks}`} detail="Camions utilises" trend="1%" icon={ClipboardList} />
        <MetricCard title="Revenus Mensuels (TTC)" value={formatMAD(totals.revenue)} detail="Factures validees" trend="+18.2%" icon={CircleDollarSign} />
      </section>

      <section className="workspace-grid">
        <div className="panel deliveries-panel">
          <div className="panel-header">
            <h2>Dernieres Livraisons</h2>
            <div className="filters" aria-label="Filtrer les livraisons">
              {["ALL", "EN_COURS", "DEMARRE", "LIVREE", "ANNULEE"].map((status) => (
                <button className={activeStatus === status ? "filter active" : "filter"} key={status} onClick={() => setActiveStatus(status)}>
                  {status === "ALL" ? "All" : normalizeStatus(status)}
                </button>
              ))}
            </div>
            <button className="primary-button" onClick={() => navigate("/livraisons")}>
              <Plus size={19} />
              Nouvelle Livraison
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Chauffeur</th>
                  <th>Camion</th>
                  <th>Destination</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => {
                  const chauffeur = findChauffeur(delivery.chauffeurId);
                  const camion = findCamion(delivery.camionId);
                  const client = findClient(delivery.clientId);

                  return (
                    <tr key={delivery.id}>
                      <td>{delivery.reference}</td>
                      <td>
                        <span className="client-mark">{client?.nom.charAt(0) ?? "C"}</span>
                        {client?.nom ?? "Client inconnu"}
                      </td>
                      <td>{chauffeur ? `${chauffeur.prenom} ${chauffeur.nom}` : "Non assigne"}</td>
                      <td>{camion ? `${camion.marque} ${camion.modele}` : "Non assigne"}</td>
                      <td>{client?.adresse ?? "A definir"}</td>
                      <td>
                        <span className={`status status-${delivery.statut.toLowerCase()}`}>{normalizeStatus(delivery.statut)}</span>
                      </td>
                      <td>{new Intl.DateTimeFormat("fr-FR").format(new Date(delivery.dateLivraison))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!isLoading && filteredDeliveries.length === 0 && <div className="empty-state">Aucune livraison pour ce filtre.</div>}
          </div>
        </div>

        <aside className="panel map-panel">
          <div className="panel-header compact">
            <h2>Carte Suivi Live</h2>
          </div>

          <div className="map-visual" aria-label="Carte schematique de suivi">
            <div className="map-city city-casa">Casablanca</div>
            <div className="map-city city-marra">Marrakech</div>
            <div className="map-city city-rabat">Rabat</div>
            <div className="route-line route-one" />
            <div className="route-line route-two" />
            <div className="pin pin-one">
              <MapPin size={24} />
            </div>
            <div className="pin pin-two">
              <Truck size={22} />
            </div>
            <div className="legend">
              <strong>Legend</strong>
              <span><i className="legend-active" />Active</span>
              <span><i className="legend-start" />Demarre</span>
              <span><i className="legend-done" />Livre</span>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}
