import { useEffect, useState } from "react";
import { Eye, Download, Filter } from "lucide-react";
import { loadDashboardData } from "../services/api";
import type { Facture, DashboardData } from "../types/domain";
import "../styles/list-page.css";

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

export function FacturationPage() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const titleEl = document.getElementById("page-title");
    const subtitleEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = "Gestion de la Facturation";
    if (subtitleEl) subtitleEl.textContent = "Consultez tous vos factures et invoices";

    loadDashboardData()
      .then(({ data }) => setData(data))
      .finally(() => setIsLoading(false));
  }, []);

  const findLivraison = (id: number) => data.livraisons.find((l) => l.id === id);
  const findClient = (id: number) => data.clients.find((c) => c.id === id);

  const totalHT = data.factures.reduce((sum, f) => sum + Number(f.montantHT), 0);
  const totalTVA = data.factures.reduce((sum, f) => sum + Number(f.montantTVA), 0);
  const totalTTC = data.factures.reduce((sum, f) => sum + Number(f.montantTTC), 0);

  return (
    <section className="page-content">
      <div className="page-header">
        <h2>Facturation</h2>
        <button className="primary-button">
          <Filter size={19} />
          Filtres
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total HT</h3>
          <p className="amount">{formatMAD(totalHT)}</p>
        </div>
        <div className="summary-card">
          <h3>TVA</h3>
          <p className="amount">{formatMAD(totalTVA)}</p>
        </div>
        <div className="summary-card highlight">
          <h3>Total TTC</h3>
          <p className="amount">{formatMAD(totalTTC)}</p>
        </div>
      </div>

      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Numéro Facture</th>
              <th>Client</th>
              <th>Livraison</th>
              <th>Montant HT</th>
              <th>TVA</th>
              <th>Montant TTC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.factures.map((facture) => {
              const livraison = findLivraison(facture.livraisonId);
              const client = livraison ? findClient(livraison.clientId) : null;

              return (
                <tr key={facture.id}>
                  <td className="invoice-number">{facture.numero}</td>
                  <td>{client?.nom ?? "Inconnu"}</td>
                  <td>{livraison?.reference ?? "-"}</td>
                  <td className="amount">{formatMAD(Number(facture.montantHT))}</td>
                  <td className="amount">{formatMAD(Number(facture.montantTVA))}</td>
                  <td className="amount total">{formatMAD(Number(facture.montantTTC))}</td>
                  <td className="actions">
                    <button className="icon-btn" title="Voir facture">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" title="Télécharger">
                      <Download size={18} />
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
