import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, ArrowRight, Package, Users, Truck, BarChart3, Shield, Zap } from "lucide-react";
import "../styles/landing.css";

const features = [
  {
    icon: Package,
    title: "Gestion des Livraisons",
    description: "Suivi en temps réel de toutes vos livraisons avec assignation automatique"
  },
  {
    icon: Users,
    title: "Équipe de Chauffeurs",
    description: "Gestion complète de votre flotte de chauffeurs avec détails et statistiques"
  },
  {
    icon: Truck,
    title: "Flotte de Camions",
    description: "Suivi de votre flotte de véhicules, maintenance et optimisation"
  },
  {
    icon: BarChart3,
    title: "Facturation Automatique",
    description: "Génération de factures PDF professionnelles avec tous les détails"
  },
  {
    icon: Shield,
    title: "Sécurité JWT",
    description: "Authentification sécurisée avec tokens JWT et gestion des rôles"
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Interface ultrarapide et réactive pour une productivité maximale"
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>("overview");

  const themes = [
    { id: "overview", label: "Vue d'ensemble", content: "Découvrez une solution complète de gestion logistique." },
    { id: "features", label: "Fonctionnalités", content: "Des outils puissants pour gérer votre entreprise efficacement." },
    { id: "security", label: "Sécurité", content: "Vos données sont protégées avec les meilleures pratiques de sécurité." },
    { id: "pricing", label: "Tarification", content: "Tarifs compétitifs adaptés à tous les types d'entreprises." }
  ];

  const currentTheme = themes.find(t => t.id === activeTheme);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="landing-navbar">
        <div className="nav-container">
          <div className="logo">
            <h1>TARIKI</h1>
            <p>Logistics Management</p>
          </div>

          <nav className="nav-menu">
            {themes.map(theme => (
              <button
                key={theme.id}
                className={`nav-link ${activeTheme === theme.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTheme(theme.id);
                  setMobileMenuOpen(false);
                }}
              >
                {theme.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="btn-login" onClick={() => navigate("/login")}>
              <LogIn size={18} />
              <span>Connexion</span>
            </button>
            <button className="btn-register" onClick={() => navigate("/register")}>
              <UserPlus size={18} />
              <span>S'inscrire</span>
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {themes.map(theme => (
              <button
                key={theme.id}
                className="mobile-nav-link"
                onClick={() => {
                  setActiveTheme(theme.id);
                  setMobileMenuOpen(false);
                }}
              >
                {theme.label}
              </button>
            ))}
            <button className="mobile-btn-login" onClick={() => navigate("/login")}>
              Connexion
            </button>
            <button className="mobile-btn-register" onClick={() => navigate("/register")}>
              S'inscrire
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Bienvenue chez TARIKI</h2>
            <p>La solution complète de gestion logistique pour votre entreprise</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Commencer Maintenant
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                J'ai déjà un compte
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="placeholder">
              <Truck size={80} />
              <span>Tariki Logistics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Content Section */}
      <section className="theme-section">
        <div className="theme-container">
          <div className="theme-content">
            <h3>{currentTheme?.label}</h3>
            <p>{currentTheme?.content}</p>

            {activeTheme === "overview" && (
              <div className="overview-content">
                <h4>À propos de TARIKI</h4>
                <p>
                  TARIKI est une plateforme moderne de gestion logistique conçue pour les entreprises de transport
                  et de livraison. Notre solution vous permet de gérer vos livraisons, votre flotte et votre équipe
                  de façon efficace et professionnelle.
                </p>
              </div>
            )}

            {activeTheme === "features" && (
              <div className="features-grid">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="feature-card">
                      <Icon size={32} />
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTheme === "security" && (
              <div className="security-content">
                <h4>Vos données sont sûres</h4>
                <ul>
                  <li>✓ Authentification JWT sécurisée</li>
                  <li>✓ Chiffrement des données sensibles</li>
                  <li>✓ Gestion des rôles et permissions</li>
                  <li>✓ Conformité aux normes de sécurité</li>
                </ul>
              </div>
            )}

            {activeTheme === "pricing" && (
              <div className="pricing-content">
                <div className="pricing-card">
                  <h4>Plan Professionnel</h4>
                  <p className="price">Contactez-nous</p>
                  <p>Accès complet à toutes les fonctionnalités de TARIKI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3>Nos Fonctionnalités Principales</h3>
        <div className="features-list">
          {features.slice(0, 3).map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-item">
                <Icon size={40} />
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h3>Prêt à démarrer?</h3>
        <p>Rejoignez des centaines d'entreprises qui font confiance à TARIKI</p>
        <button className="btn-large" onClick={() => navigate("/register")}>
          Créer un compte
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 TARIKI Logistics. Tous droits réservés.</p>
        <div className="footer-links">
          <a href="#privacy">Confidentialité</a>
          <a href="#terms">Conditions</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}
