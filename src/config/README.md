# Configuration

Ce dossier contient les fichiers de configuration de l’application ApexTime, comme la configuration de Firebase ou d’autres services externes.

## Fichiers

- **firebase.ts** : Configuration et initialisation de Firebase (authentification, base de données, stockage).

## Exemple de configuration (firebase.ts)
```ts
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'apextime.firebaseapp.com',
  // ...
};
export const app = initializeApp(firebaseConfig);
```

## Conventions
- Ne jamais versionner les clés ou secrets sensibles.
- Utiliser des variables d’environnement pour les informations confidentielles.
- Documenter chaque nouveau fichier de configuration.

## Ajouter une configuration
1. Créer le fichier dans ce dossier.
2. Ajouter une documentation dans ce README.
3. Respecter les conventions de sécurité.

## Contribution
- Toute modification doit être validée par l’équipe technique.

## Auteurs
- Equipe ApexTime
