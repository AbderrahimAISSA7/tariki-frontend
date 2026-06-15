export type DeliveryStatus = "EN_COURS" | "LIVREE" | "DEMARRE" | "ANNULEE" | string;

export interface Chauffeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface Camion {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  capacite: number;
}

export interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

export interface Livraison {
  id: number;
  reference: string;
  dateLivraison: string;
  statut: DeliveryStatus;
  chauffeurId: number;
  camionId: number;
  clientId: number;
}

export interface Facture {
  id: number;
  numero: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  livraisonId: number;
}

export interface Signature {
  id: number;
  signataire: string;
  dateSignature: string;
  type: "CHAUFFEUR" | "CLIENT" | string;
  livraisonId: number;
}

export interface DashboardData {
  livraisons: Livraison[];
  chauffeurs: Chauffeur[];
  camions: Camion[];
  clients: Client[];
  factures: Facture[];
  signatures: Signature[];
}
