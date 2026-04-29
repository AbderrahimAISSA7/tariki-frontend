# 🎨 Tariki Frontend

Interface web moderne de l'application **Tariki**.

## 🎯 Objectif
Permettre aux entreprises de :
- gérer leurs livraisons
- gérer chauffeurs et camions
- suivre les opérations

---

## 🧠 Architecture


Frontend → API Backend → Database


---

## 🧩 Structure


src/
├── pages/ # pages principales
├── components/ # composants UI
├── services/ # appels API
├── layout/ # structure globale
└── assets/ # styles, images


---

## 📱 Pages principales

### Dashboard
- Vue globale
- Statuts des livraisons

### Livraisons
- Création
- Suivi
- Assignation

### Chauffeurs
- Liste
- Statut (en ligne / hors ligne)

### Camions
- Gestion flotte

### Factures
- Consultation
- Téléchargement

---

## 👤 Interface Client (simple)

- Statut livraison
- Zone du chauffeur
- Signature réception

---

## 🎨 UX/UI

Objectifs :
- moderne
- rapide
- responsive
- simple à utiliser

---

## 🔄 Workflow utilisateur

### Admin

Créer livraison → Assigner → Suivre → Facture


### Chauffeur

Se connecter → Voir missions → Démarrer → Terminer → Signer


### Client

Voir statut → Suivre → Signer


---

## 🔗 Communication

- Appels API REST vers backend
- Mise à jour des données en temps réel (simplifié)

---

## 🚀 Objectif MVP

Une interface simple permettant :
- gestion complète des opérations
- visibilité claire
- expérience fluide
