# Utilitaires

Ce dossier regroupe les fonctions utilitaires et helpers réutilisables dans toute l’application ApexTime (génération d’ID, QR code, géolocalisation, etc.).

## Fichiers

- **benefitsHelper.ts** : Fonctions utilitaires pour la gestion des avantages employés.
- **constants.ts** : Constantes globales utilisées dans l’application.
- ...

## Exemple d’utilisation
```ts
import { generateId } from './helpers';
const id = generateId();
```

## Ajouter un utilitaire
1. Créer un fichier `monHelper.ts`.
2. Exporter la fonction ou la classe.
3. Documenter l’utilitaire ici.

## Bonnes pratiques
- Privilégier la simplicité et la réutilisabilité.
- Éviter la duplication de code.
- Ajouter des tests unitaires.

## Documentation
- Documenter chaque fonction complexe avec des exemples.
- Mettre à jour ce README à chaque ajout majeur.

## Auteurs
- Equipe ApexTime
