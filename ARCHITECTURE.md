# Architecture Front-End - Télesport

## Vue d'ensemble

L'application Télesport est une application Angular structurée selon le pattern de séparation des responsabilités. Elle affiche des statistiques olympiques par pays avec des visualisations en graphiques.

### Stack technologique
- **Framework** : Angular
- **Langage** : TypeScript
- **Visualisation** : Chart.js
- **Données** : JSON statique (préparation pour une API future)

---

## Architecture générale

```
src/app/
├── pages/              # Vues de route (consommatrices de services)
├── components/         # Composants réutilisables
├── services/           # Logique métier et accès aux données
├── models/             # Interfaces et types TypeScript
├── app.module.ts       # Module racine
├── app-routing.module.ts
├── app.component.ts    # Composant racine
└── environments/       # Configuration par environnement
```

### Principes directeurs
- **Séparation des responsabilités** : chaque bloc a un rôle unique
- **Single Source of Truth** : les données passent par le service
- **Scalabilité** : structure prête pour une connexion back-end/API


## Couches de l'application

### 1. **Pages** (`src/app/pages/`)

Pages de route qui représentent les vues principales de l'application. Elles consomment les services et orchestrent la logique de présentation.

#### `home/` - Accueil
- Affiche un résumé global : nombre de pays, nombre de JOs, nombre total de médailles
- Présente un graphique en secteurs (pie chart) des médailles par pays
- Point d'entrée principal de l'application

#### `country/:countryName` - Détail pays
- Affiche les statistiques d'un pays spécifique
- Nombre d'entrées aux JOs, total de médailles, total d'athlètes
- Graphique chronologique (line chart) des médailles par année
- Gestion de la route paramétrée

#### `not-found/` - Page d'erreur
- Affiché pour toute route non trouvée ou pays inexistant
- Redirection automatique si le pays n'existe pas

---

### 2. **Composants** (`src/app/components/`)

Composants UI réutilisables et découplés de la logique métier.

#### `header/`
- Barre de navigation commune à toutes les pages
- Accessible depuis toutes les pages de l'application

#### `chart/`
- Composant de visualisation agnostique
- Encapsule la configuration et le rendu Chart.js
- Accepte les données et le type de graphique en entrée
- Réutilisable pour différents types de graphiques

---

### 3. **Services** (`src/app/services/`)

Couche de logique métier et d'accès aux données. Injectables et singletons (providedIn: 'root').

#### `OlympicDataService`
Principal service de l'application avec les responsabilités suivantes :

**Accès aux données :**
- `getOlympics()` : récupère la liste complète des pays et leurs participations
- `getCountryByName(countryName)` : récupère un pays spécifique par son nom

**Calculs métier :**
- `getTotalJOs(olympics)` : nombre unique d'années de participation
- `getMedalCountsByCountry(olympics)` : tableau des totaux de médailles par pays
- `getCountryNames(olympics)` : liste des noms de pays
- `getTotalOlympics(olympics)` : nombre total de pays

**Architecture flexible :**
- Source de données configurée via `environment.apiUrl` (futur backend) ou `environment.mockDataUrl` (données statiques)
- Permet une transition facile vers un vrai backend sans refonte


## Préparation pour l'intégration d'une API

L'architecture est conçue pour accueillir une API backend sans refonte majeure.

### Points de passage clés

1. **Configuration d'environnement** (`src/environments/`)
   ```typescript
   environment.apiUrl = 'https://api.exemple.com/olympics'
   environment.mockDataUrl = '/assets/mock/olympic.json'
   ```

2. **Service centralisé** 
   - Seul point d'accès aux données
   - Les changements de source de données y sont isolés
   - Les pages n'ont pas besoin de changer

3. **Modèles réutilisables**
   - Les interfaces `Olympic`, `Participation` restent identiques
   - Les réponses de l'API doivent correspondre à ces structures

---

## Bonnes pratiques

### ✅ Respectées
1. **Séparation des responsabilités** : Pages → Services → Modèles
2. **Injection de dépendances** : Services injectables avec providedIn
3. **Types TypeScript** : Interfaces pour toutes les structures de données
4. **Observable pattern** : RxJS pour les données asynchrones
5. **Modularité** : Facile d'ajouter de nouvelles pages ou services

### Étapes pour intégrer une API

1. Remplacer `mockDataUrl` par `apiUrl` dans la configuration
2. Adapter le service pour gérer les erreurs HTTP
3. Ajouter un intercepteur pour les headers d'authentification si nécessaire
4. Mettre en place un système de cache (HttpClient cache, RxJS shareReplay)
5. Gérer les états de chargement et les erreurs dans les pages


## Pour un nouveau développeur

### Démarrage rapide

1. Les **pages** affichent l'interface, utilisateur = point d'entrée
2. Les **services** fournissent les données = système nerveux de l'app
3. Les **modèles** définissent la structure = contrat entre pages et services
4. Les **composants** réutilisables = briques UI



## Ressources
- [Angular Docs - Services](https://angular.io/guide/architecture-services)
- [RxJS Guide - Observables](https://rxjs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
