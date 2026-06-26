import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Settings, Truck, UsersRound, Boxes, ReceiptText, LayoutDashboard } from "lucide-react";
import logo from "../assets/tariki-logo.png";
import "../styles/layout.css";

const navItems = [
  { label: "Tableau de Bord", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Livraisons", icon: Truck, path: "/livraisons" },
  { label: "Chauffeurs", icon: UsersRound, path: "/chauffeurs" },
  { label: "Camions", icon: Boxes, path: "/camions" },
  { label: "Facturation", icon: ReceiptText, path: "/facturation" },
  { label: "Parametres", icon: Settings, path: "/parametres" }
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      return { nom: "Tariki", prenom: "Admin", role: "ADMIN" };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { nom: "Tariki", prenom: "Admin", role: "ADMIN" };
    }
  }, [location.pathname]);

  const initials = `${(currentUser?.prenom || "T").charAt(0)}${(currentUser?.nom || "A").charAt(0)}`.toUpperCase();
  const fullName = `${currentUser?.prenom || "Tariki"} ${currentUser?.nom || "Admin"}`;
  const roleLabel = String(currentUser?.role || "ADMIN").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <div className="brand">
          <img src={logo} alt="Tariki" />
        </div>

        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon, path }) => (
            <Link
              to={path}
              key={label}
              className={`nav-item ${location.pathname === path ? "active" : ""}`}
            >
              <Icon size={21} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="operator">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{fullName}</strong>
            <span>{roleLabel}</span>
          </div>
          <button className="icon-button" aria-label="Parametres du profil">
            <Settings size={19} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 id="page-title">Tableau de Bord Global</h1>
            <p id="page-subtitle">Bienvenue, Tariki Admin!</p>
          </div>

          <div className="top-actions">
            <button className="notification-button" aria-label="Notifications">
              <Bell size={22} />
              <span>5</span>
            </button>
            <div className="user-chip-wrapper">
              <button
                className="user-chip"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Menu profil utilisateur"
              >
                <div className="profile-photo">{initials}</div>
                <strong>{fullName}</strong>
                <ChevronDown size={19} />
              </button>

              {showProfileMenu && (
                <div className="profile-menu">
                  <Link to="/profil" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                    <span>Mon Profil</span>
                  </Link>
                  <Link to="/parametres" className="menu-item" onClick={() => setShowProfileMenu(false)}>
                    <Settings size={18} />
                    <span>Paramètres</span>
                  </Link>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
