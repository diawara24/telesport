# TeleSport

## Sommaire

- [Description](#description)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [Dépendances principales](#d%C3%A9pendances-principales)
- [Fonctionnalités](#fonctionnalit%C3%A9s)
- [Captures d’écran](#captures-d%C3%A9cran)

## Description

`TeleSport` est une application Angular qui présente des données olympiques sous forme de tableau, de cartes et de graphiques. Le projet utilise des interfaces TypeScript, un service de récupération de données JSON et des composants réutilisables pour organiser l’interface.

## Lancement

1. Ouvrez un terminal dans le répertoire du projet.
2. Installez les dépendances :

```bash
npm install
```

3. Démarrez l’application en mode développement :

```bash
npm start
```

4. Ouvrez le navigateur à l’adresse suivante :

```text
http://localhost:4200/
```

## Structure du projet

Voici l’architecture principale du projet :

- `angular.json` : configuration de build et de serve pour Angular.
- `package.json` : scripts et dépendances du projet.
- `src/` : code source de l’application.
  - `src/app/` : application Angular.
    - `components/` : composants réutilisables.
      - `chart/` : composant de graphique.
      - `header/` : composant d’en-tête.
    - `models/` : modèles TypeScript.
      - `indicator.model.ts`
      - `olympic.model.ts`
      - `participation.model.ts`
    - `pages/` : pages de routage.
      - `country/` : page pays.
      - `home/` : page d’accueil.
      - `not-found/` : page 404.
    - `services/` : service de données.
      - `olympic-data.service.ts`
  - `src/assets/` : ressources statiques.
    - `mock/olympic.json` : données JSON utilisées dans l’application.
    - `images/teleSport.png` : capture d’écran disponible.
  - `src/environments/` : fichiers d’environnement.

## Dépendances principales

- `@angular/core`, `@angular/router`, `@angular/forms`
- `chart.js` : pour l’affichage des graphiques
- `rxjs` : pour la gestion des flux réactifs

## Fonctionnalités

- Chargement des données olympiques depuis un fichier JSON local.
- Affichage des informations par pays et indicateurs.
- Graphiques intégrés via `Chart.js`.
- Navigation entre une page d’accueil, une page pays et une page 404.

## Captures d’écran

![Capture de TeleSport](src/assets/images/teleSport.png)

> Si l’image ne s’affiche pas dans GitHub, vérifiez que le chemin relatif `src/assets/images/teleSport.png` est bien présent dans le dépôt.
