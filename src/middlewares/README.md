# Middlewares

Ce dossier contient les middlewares utilisés pour intercepter et traiter les actions ou requêtes dans l’application ApexTime (ex : gestion des permissions ou de l’authentification dans Redux).

## Fichiers

- **authMiddleware.ts** : Middleware pour la gestion des permissions et de l’authentification dans Redux.

## Fonctionnement général
Un middleware permet d’intercepter une action ou une requête avant qu’elle n’atteigne le reducer ou le backend. Il peut servir à :
- Vérifier des permissions
- Logger des actions
- Modifier ou bloquer des actions

## Exemple d’utilisation
```ts
import { authMiddleware } from './authMiddleware';
// Utilisation dans le store Redux
```

## Ajouter un middleware
1. Créer un fichier `monMiddleware.ts`.
2. L’ajouter à la configuration du store ou du backend.
3. Documenter le middleware dans ce README.

## Auteurs
- Equipe ApexTime
