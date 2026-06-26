import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, LogOut, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import "../styles/profile-page.css";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  address: string;
  avatar: string;
}

interface StoredUser {
  id?: number;
  prenom?: string;
  nom?: string;
  email?: string;
  role?: string;
  telephone?: string;
  address?: string;
}

function roleToLabel(role?: string) {
  const normalized = String(role ?? "").toUpperCase();
  if (normalized === "ADMIN") return "Administrateur";
  if (normalized === "CHAUFFEUR") return "Chauffeur";
  if (normalized === "CLIENT") return "Client";
  return "Utilisateur";
}

function buildProfileFromStoredUser(stored?: StoredUser): UserProfile {
  const firstName = stored?.prenom || "Tariki";
  const lastName = stored?.nom || "User";
  const avatar = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return {
    id: stored?.id ?? 0,
    firstName,
    lastName,
    email: stored?.email || "",
    phone: stored?.telephone || "Non renseigné",
    role: roleToLabel(stored?.role),
    joinDate: "2026-01-01",
    address: stored?.address || "Non renseignée",
    avatar
  };
}

export function ProfilPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(buildProfileFromStoredUser());

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const storedUser: StoredUser = JSON.parse(rawUser);
        setProfile(buildProfileFromStoredUser(storedUser));
      } catch {
        setProfile(buildProfileFromStoredUser());
      }
    }

    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Mon Profil";
    if (subtitleEl) subtitleEl.textContent = "Consultez et modifiez vos informations personnelles";
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleEditChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    const rawUser = localStorage.getItem("user");
    let user: StoredUser = {};
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch {
        user = {};
      }
    }

    const updatedUser: StoredUser = {
      ...user,
      prenom: profile.firstName,
      nom: profile.lastName,
      email: profile.email,
      telephone: profile.phone,
      address: profile.address
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <section className="page-content profile-page">
      <div className="profile-container">
        {/* Carte d'identité utilisateur */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-large">{profile.avatar}</div>
            <div className="profile-info">
              <h1>{profile.firstName} {profile.lastName}</h1>
              <p className="role">
                <Shield size={18} />
                {profile.role}
              </p>
            </div>
            <div className="profile-actions">
              <button
                className={isEditing ? "secondary-button" : "primary-button"}
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                <Edit2 size={19} />
                {isEditing ? "Enregistrer" : "Modifier Profil"}
              </button>
            </div>
          </div>

          {/* Détails du profil */}
          <div className="profile-details">
            <div className="detail-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                />
              ) : (
                <p>
                  <Mail size={18} />
                  {profile.email}
                </p>
              )}
            </div>

            <div className="detail-group">
              <label>Téléphone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleEditChange("phone", e.target.value)}
                />
              ) : (
                <p>
                  <Phone size={18} />
                  {profile.phone}
                </p>
              )}
            </div>

            <div className="detail-group">
              <label>Adresse</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleEditChange("address", e.target.value)}
                />
              ) : (
                <p>
                  <MapPin size={18} />
                  {profile.address}
                </p>
              )}
            </div>

            <div className="detail-group">
              <label>Date d'Adhésion</label>
              <p>
                <Calendar size={18} />
                {new Intl.DateTimeFormat("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }).format(new Date(profile.joinDate))}
              </p>
            </div>
          </div>
        </div>

        {/* Sections supplémentaires */}
        <div className="profile-sections">
          <div className="section">
            <h2>Statistiques</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">42</span>
                <span className="stat-label">Livraisons Gérées</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">15</span>
                <span className="stat-label">Chauffeurs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">8</span>
                <span className="stat-label">Camions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">125,000 MAD</span>
                <span className="stat-label">Revenus Totaux</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Actions</h2>
            <div className="action-list">
              <button className="secondary-button">
                <Edit2 size={19} />
                Changer le Mot de Passe
              </button>
              <button className="secondary-button danger" onClick={handleLogout}>
                <LogOut size={19} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
