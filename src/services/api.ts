import type { Camion, Chauffeur, Client, DashboardData, Facture, Livraison, Signature } from "../types/domain";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fallbackData: DashboardData = {
  chauffeurs: [
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@translog.com", telephone: "0600000001" },
    { id: 2, nom: "Martin", prenom: "Paul", email: "paul.martin@translog.com", telephone: "0600000002" }
  ],
  camions: [
    { id: 1, immatriculation: "AB-123-CD", marque: "Renault", modele: "Premium", capacite: 20 },
    { id: 2, immatriculation: "EF-456-GH", marque: "Mercedes", modele: "Actros", capacite: 25 }
  ],
  clients: [
    { id: 3, nom: "Societe Alpha", email: "contact@alpha.com", telephone: "0700000001", adresse: "10 avenue Alpha" },
    { id: 4, nom: "Societe Beta", email: "contact@beta.com", telephone: "0700000002", adresse: "20 avenue Beta" }
  ],
  livraisons: [
    { id: 1, reference: "LIV001", dateLivraison: "2024-06-01", statut: "EN_COURS", chauffeurId: 1, camionId: 1, clientId: 3 },
    { id: 2, reference: "LIV002", dateLivraison: "2024-06-02", statut: "LIVREE", chauffeurId: 2, camionId: 2, clientId: 4 }
  ],
  factures: [
    { id: 1, numero: "FAC001", montantHT: 100, montantTVA: 20, montantTTC: 120, livraisonId: 1 },
    { id: 2, numero: "FAC002", montantHT: 200, montantTVA: 40, montantTTC: 240, livraisonId: 2 }
  ],
  signatures: [
    { id: 1, signataire: "Jean Dupont", dateSignature: "2024-06-01T10:00:00", type: "CHAUFFEUR", livraisonId: 1 },
    { id: 2, signataire: "Client Alpha", dateSignature: "2024-06-01T11:00:00", type: "CLIENT", livraisonId: 1 }
  ]
};

async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API ${response.status} sur ${endpoint}`);
  }

  return response.json() as Promise<T>;
}

export async function loadDashboardData(): Promise<{ data: DashboardData; isFallback: boolean }> {
  try {
    const [livraisons, chauffeurs, camions, clients, factures, signatures] = await Promise.all([
      getJson<Livraison[]>("/api/livraisons"),
      getJson<Chauffeur[]>("/api/chauffeurs"),
      getJson<Camion[]>("/api/camions"),
      getJson<Client[]>("/api/clients"),
      getJson<Facture[]>("/api/factures"),
      getJson<Signature[]>("/api/signatures")
    ]);

    return { data: { livraisons, chauffeurs, camions, clients, factures, signatures }, isFallback: false };
  } catch (error) {
    console.warn("Backend Tariki indisponible, utilisation des donnees de demonstration.", error);
    return { data: fallbackData, isFallback: true };
  }
}
