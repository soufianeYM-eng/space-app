# SpaceTraders Application

Application web Vue 3 + TypeScript pour la gestion d'opérations de trading spatial, construite sur l'API SpaceTraders.

## 🚀 Installation & Setup

### Prérequis

- Node.js `^20.19.0` ou `>=22.12.0`
- npm, yarn ou pnpm

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd space-app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

### Configuration

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

```bash
VITE_API_BASE_URL=https://api.spacetraders.io/v2
```

### Lancer le projet

```bash
# Démarrer le serveur de développement
npm run app:dev

# L'application sera accessible sur http://localhost:9000
```

## 📜 Scripts disponibles

| Script            | Commande              | Description                            |
| ----------------- | --------------------- | -------------------------------------- |
| **Développement** | `npm run app:dev`     | Lance le serveur de développement Vite |
| **Build**         | `npm run app:build`   | Build de production (avec type-check)  |
| **Preview**       | `npm run app:preview` | Prévisualise le build de production    |
| **Tests**         | `npm run test`        | Lance les tests unitaires Vitest       |
| **Type-check**    | `npm run type-check`  | Vérification TypeScript avec vue-tsc   |

## 🏗️ Architecture

### Technologies

- **Vue 3.5** - Framework JavaScript avec Composition API
- **TypeScript 5.9** - Typage statique
- **Vite 7.1** - Build tool et dev server
- **PrimeVue 4.4** - Composants UI (thème Aura)
- **Pinia 3.0** - State management
- **Vue Router 4.6** - Routing client-side
- **Axios 1.13** - Client HTTP
- **Vitest 3.2** - Tests unitaires

### Structure du projet

```
src/
├── api/                    # Configuration Axios (interceptors)
├── assets/                 # Images et styles globaux
├── components/             # Composants réutilisables
│   └── app-headbar/       # Header de navigation
├── composables/            # Composables partagés (pagination)
├── managers/               # Managers (TokenManager)
├── pages/                  # Pages de l'application
│   ├── agent/             # Détails agent
│   ├── fleet/             # Gestion flotte
│   ├── home/              # Dashboard
│   ├── login/             # Authentification
│   ├── markets/           # Trading & marchés
│   └── systems/           # Exploration systèmes
├── router/                 # Configuration Vue Router
│   └── guards/            # Guards d'authentification
├── services/               # Couche service API
│   ├── auth/              # Service authentification
│   ├── fleet/             # Service flotte
│   ├── markets/           # Service marchés
│   └── systems/           # Service systèmes
├── stores/                 # Stores Pinia
│   ├── agent.store.ts     # État agent
│   └── auth.store.ts      # État authentification
└── types/                  # Définitions TypeScript
```

### Organisation du code

- **Pages** : Composants de page organisés par feature
- **Services** : Abstraction de l'API SpaceTraders
- **Stores** : State management avec Pinia (auth, agent)
- **Guards** : Protection des routes (authentification)
- **Composables** : Logique réutilisable (pagination, data fetching)
- **Types** : Interfaces TypeScript pour typage fort

### Flux d'authentification

1. Connexion avec token SpaceTraders
2. Token stocké via TokenManager (localStorage)
3. Intercepteurs Axios ajoutent le token aux requêtes
4. Guard d'authentification protège les routes privées
5. Auto-déconnexion en cas de token invalide (401)

## 🔧 Développement

### IDE recommandé

- VS Code + Extension Vue (Volar)
- Extensions : ESLint, Prettier, Volar

### Workflow de développement

1. Créer une branche feature
2. Développer avec hot-reload (`npm run app:dev`)
3. Lancer les tests (`npm run test`)
4. Vérifier les types (`npm run type-check`)
5. Commit et push

## 🚢 Déploiement

Le projet utilise GitHub Actions pour le déploiement automatique sur Vercel :

- Push sur `develop` → Déploiement production
- Pull Request → Déploiement preview

### Variables requises (GitHub Secrets)

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 👤 Author

**Soufiane YOUSFI MGHARI**
