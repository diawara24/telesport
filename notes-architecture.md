# notes d'architecture et problèmes identifiés

## Observations générales

- L'application est structurée autour de pages dans `src/app/pages`
- Il n'existe pas de dossier `services`, `core`, `shared` ou `models` pour isoler la logique métier et les types.
- Le composant racine `AppComponent` est quasi vide et se contente d'héberger le `router-outlet`.

## Anti-patterns détectés

### Données gérées directement dans les composants
- `HomeComponent` charge `assets/mock/olympic.json` via `HttpClient` et effectue toute la transformation des données dans le composant.
- `CountryComponent` charge aussi `assets/mock/olympic.json`, filtre les données, calcule des totaux et prépare le graphique dans le composant.
- Ces deux composants gèrent à la fois la récupération des données, les transformations métier et la logique de présentation.
- Dans un vrai projet, ces responsabilités devraient être extraites dans un service dédié et des modèles/DTOs devraient être utilisés au lieu de `any`.

### Traitement des données et logique métier dans les composants
- `HomeComponent` calcule le nombre total de pays, le nombre de JOs, la somme des médailles et construit le graphique.
- `CountryComponent` extrait le paramètre de route, recherche le pays correspondant, calcule le nombre d'entrées, les médailles totales et le nombre d'athlètes, puis construit un graphique.
- Cette logique est trop lourde pour un composant de page et devrait être déplacée dans une couche de service.

## Problèmes de robustesse

- `CountryComponent` n'assure pas de traitement si `selectedCountry` est introuvable : si le paramètre de route n'existe pas ou si le pays n'est pas dans les données, le composant peut lever des erreurs.
- Il n'y a pas de gestion d'erreur ou de page de secours côté pays introuvable dans le flux normal.
- Les composants utilisent beaucoup `any`, ce qui rend la maintenance et la compréhension du code plus difficiles.

## Organisation des fichiers

- Aucun service n'est présent dans le dossier `src/app` ou dans une sous-arborescence existante.
- Il n'y a pas de fichiers manifestement mal placés (par exemple un service dans un dossier de composants), mais l'organisation reste très basique.
- Le code de création de graphiques avec Chart.js est intégré dans les composants, ce qui mélange la logique de rendu avec la logique d'accès aux données.

## Comportement visuel / logique attendu

- `HomeComponent` affiche un résumé des pays et un graphique en secteurs des médailles par pays.
- `CountryComponent` affiche un résumé des participations d'un pays, le nombre de médailles, le nombre d'athlètes, et un graphique chronologique.
- `NotFoundComponent` est simple et affiche un message de page introuvable.

## Recommandations avant refactorisation

- Extraire la logique d'appel HTTP et de transformation des données dans un `DataService` ou équivalent.
- Créer des interfaces ou classes de modèle pour `Country`, `Participation`, etc.
- Ajouter un dossier `services` et éventuellement un dossier `models` dans `src/app`.
- Prévoir un comportement clair lorsque la route `country/:countryName` ne correspond à aucun pays.
- Séparer la logique de création de graphiques de la logique de récupération des données.

## Proposition d'architecture Angular claire

L'objectif est de  bien séparée les responsabilité :
- `pages/` pour les vues de route principales,
- `components/` pour les éléments UI réutilisables,
- `services/` pour tous les accès aux données et la logique métier,
- `models/` pour les types et interfaces des données.

### Nouvelle arborescence proposée

```
src/app/
├── components/
│   └── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   ├── header.component.scss
│   │   └── header.component.spec.ts
├── pages/
│   ├── home/
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   ├── home.component.scss
│   │   └── home.component.spec.ts
│   ├── country/
│   │   ├── country.component.ts
│   │   ├── country.component.html
│   │   ├── country.component.scss
│   │   └── country.component.spec.ts
│   └── not-found/
│       ├── not-found.component.ts
│       ├── not-found.component.html
│       ├── not-found.component.scss
│       └── not-found.component.spec.ts
├── services/
│   └── olympic-data.service.ts
├── models/
│   ├── country.model.ts
│   └── participation.model.ts
├── app-routing.module.ts
├── app.component.ts
├── app.component.html
├── app.component.scss
└── app.module.ts
```

### Rôle de chaque bloc

- `pages/` : pages de route; elles consomment les services et affichent l'UI.
- `components/` : composants isolés et réutilisables pour les éléments d'interface (cartes, tableaux, etc.).
- `services/` : point unique d'accès aux données. Utiliser un service singleton injectable pour charger `olympic.json` et fournir des méthodes métier.
- `models/` : définitions de types fortes pour `Country`, `Participation`, le payload API, etc.

### Patterns adaptés

- `Singleton` pour les services Angular injectables (un service unique par application via `providedIn: 'root'`).
- `Separation of concerns` : chaque composant se concentre sur l'affichage et la navigation, pas sur la récupération/traitement des données.

### Avantages attendus

- meilleure maintenabilité : la logique métier ne sera plus dispersée dans les composants,
- testabilité améliorée : les services peuvent être testés isolément,
- évolutivité : si l'API change, seuls les services et modèles sont impactés,
- clarté pour les développeurs : chaque dossier a une responsabilité définie.

### Déplacements virtuels

- `HomeComponent` et `CountryComponent` restent dans `pages/`.
- La logique actuelle de `HttpClient` et de filtrage des données ira dans `services/olympic-data.service.ts`.
- Les types `Country` et `Participation` iront dans `models/country.model.ts` et `models/participation.model.ts`.
- `app.module.ts` et `app-routing.module.ts` restent à la racine de `src/app`.


