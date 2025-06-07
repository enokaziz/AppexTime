# Écrans

Ce dossier contient tous les composants d’écran de l’application ApexTime. Chaque fichier d’écran représente une page ou une vue spécifique de l’application.

## Fichiers

- **Auth/ForgotPasswordScreen.tsx** : Écran de récupération du mot de passe.
- **Auth/LoginScreen.tsx** : Écran de connexion pour l’authentification.
- **Auth/SignupScreen.tsx** : Écran d’inscription des utilisateurs.
- ...

## Structure type d’un écran
```tsx
import React from 'react';
import { View, Text } from 'react-native';

const ExampleScreen = () => (
  <View>
    <Text>Contenu de l’écran</Text>
  </View>
);
export default ExampleScreen;
```

## Conventions
- Un fichier = un écran.
- Utiliser le suffixe `Screen`.
- Organiser par domaine fonctionnel (auth, employee, dashboard, etc.).
- Documenter les props et hooks utilisés.

## Ajouter un écran
1. Créer le fichier dans le bon sous-dossier.
2. Respecter la structure type ci-dessus.
3. Ajouter une description ici.
4. Mettre à jour la navigation si besoin.

## Conseils
- Séparer la logique métier et la présentation (hooks, composants).
- Préférer des composants réutilisables.
- Ajouter des tests si possible.

## Auteurs
- Equipe ApexTime
