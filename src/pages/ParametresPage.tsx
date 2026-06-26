import { useEffect, useState } from "react";
import { Save, Bell, Lock, Users, Globe } from "lucide-react";
import "../styles/settings-page.css";

export function ParametresPage() {
  const [settings, setSettings] = useState({
    appName: "Tariki Delivery",
    email: "admin@tariki.ma",
    notificationsEmail: true,
    notificationsSMS: false,
    privateProfile: false,
    language: "fr"
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Paramètres";
    if (subtitleEl) subtitleEl.textContent = "Gérez les paramètres de votre application";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setSettings((prev) => ({ ...prev, [name]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Paramètres sauvegardés:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="page-content settings-page">
      <div className="settings-container">
        <div className="settings-section">
          <div className="section-header">
            <Globe size={24} />
            <h2>Paramètres Généraux</h2>
          </div>

          <div className="form-group">
            <label htmlFor="appName">Nom de l'Application</label>
            <input
              type="text"
              id="appName"
              name="appName"
              value={settings.appName}
              onChange={handleChange}
              placeholder="Nom de votre application"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Langue</label>
            <select id="language" name="language" value={settings.language} onChange={handleChange}>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>Notifications</h2>
          </div>

          <div className="form-group toggle">
            <label htmlFor="notificationsEmail">Notifications par Email</label>
            <input
              type="checkbox"
              id="notificationsEmail"
              name="notificationsEmail"
              checked={settings.notificationsEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group toggle">
            <label htmlFor="notificationsSMS">Notifications par SMS</label>
            <input
              type="checkbox"
              id="notificationsSMS"
              name="notificationsSMS"
              checked={settings.notificationsSMS}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Users size={24} />
            <h2>Confidentialité</h2>
          </div>

          <div className="form-group toggle">
            <label htmlFor="privateProfile">Profil Privé</label>
            <input
              type="checkbox"
              id="privateProfile"
              name="privateProfile"
              checked={settings.privateProfile}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Lock size={24} />
            <h2>Sécurité</h2>
          </div>

          <button className="secondary-button">
            <Lock size={19} />
            Changer le Mot de Passe
          </button>
        </div>

        <div className="action-buttons">
          <button className="primary-button" onClick={handleSave}>
            <Save size={19} />
            Enregistrer les Paramètres
          </button>
          {saved && <span className="success-message">✓ Paramètres sauvegardés avec succès!</span>}
        </div>
      </div>
    </section>
  );
}
