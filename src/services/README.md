# Services

Ce dossier regroupe les services et modules de logique métier de l’application ApexTime (API, gestion des employés, congés, notifications, etc.).

## Fichiers

- **CacheService.ts** : Gestion du cache local de l’application.
- **api.ts** : Fonctions pour les appels à l’API.
- ...

## Exemple d’utilisation
```ts
import { getEmployees } from './employee';
getEmployees().then(list => console.log(list));
```

## Ajouter un service
1. Créer un fichier `monService.ts`.
2. Exporter les fonctions ou classes nécessaires.
3. Documenter le service ici.

## Gestion des erreurs
- Toujours gérer les erreurs réseau ou API avec try/catch.
- Retourner des messages d’erreur explicites.

## Dépendances
- Utilise par exemple `axios` pour les appels API.
- Voir la documentation de chaque service pour les dépendances spécifiques.

## Auteurs
- Equipe ApexTime
