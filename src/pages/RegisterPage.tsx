import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, UserPlus, AlertCircle } from "lucide-react";
import "../styles/auth.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          telephone,
          password,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.prenom || data?.message || "Erreur lors de l'inscription");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role
      }));

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h1>TARIKI</h1>
            <h2>S'inscrire</h2>
            <p>Créez votre compte pour commencer</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <div className="input-wrapper">
                  <User size={20} />
                  <input
                    type="text"
                    id="prenom"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <div className="input-wrapper">
                  <User size={20} />
                  <input
                    type="text"
                    id="nom"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <div className="input-wrapper">
                <Phone size={20} />
                <input
                  type="tel"
                  id="telephone"
                  placeholder="+212 6 XX XX XX XX"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select-input"
              >
                <option value="CLIENT">Client</option>
                <option value="CHAUFFEUR">Chauffeur</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              <UserPlus size={20} />
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Vous avez déjà un compte?{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            </p>
            <button
              type="button"
              className="link-button back-home"
              onClick={() => navigate("/")}
            >
              Retourner à l'accueil
            </button>
          </div>
        </div>

        <div className="auth-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
}
