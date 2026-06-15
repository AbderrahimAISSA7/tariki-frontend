import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Truck,
  UsersRound
} from "lucide-react";
import logo from "./assets/tariki-logo.png";
import { loadDashboardData } from "./services/api";
import type { DashboardData, DeliveryStatus } from "./types/domain";

const navItems = [
  { label: "Tableau de Bord", icon: LayoutDashboard },
  { label: "Livraisons", icon: Truck },
  { label: "Chauffeurs", icon: UsersRound },
  { label: "Camions", icon: Boxes },
  { label: "Facturation", icon: ReceiptText },
  { label: "Parametres", icon: Settings }
];

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

function App() {
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
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <div className="brand">
          <img src={logo} alt="Tariki" />
        </div>

        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }, index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} key={label}>
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="operator">
          <div className="avatar">AT</div>
          <div>
            <strong>Admin Tariki</strong>
            <span>Administrateur</span>
          </div>
          <button className="icon-button" aria-label="Parametres du profil">
            <Settings size={19} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Tableau de Bord Global</h1>
            <p>Bienvenue, Tariki Admin!</p>
          </div>

          <div className="top-actions">
            <button className="notification-button" aria-label="Notifications">
              <Bell size={22} />
              <span>5</span>
            </button>
            <div className="user-chip">
              <div className="profile-photo">SB</div>
              <strong>Sara Bennani</strong>
              <ChevronDown size={19} />
            </div>
          </div>
        </header>

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
              <button className="primary-button">
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
              <button className="icon-button" aria-label="Options carte">
                <Settings size={18} />
              </button>
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
      </main>
    </div>
  );
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

export default App;
