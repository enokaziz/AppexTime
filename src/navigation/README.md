# Navigation

Ce dossier gère la navigation de l’application ApexTime (stacks, types de navigation, routes, etc.).

## Fichiers

- **AppNavigator.tsx** : Navigateur principal de l’application.
- **AuthNavigator.tsx** : Navigateur pour les écrans d’authentification.
- **MainNavigator.tsx** : Navigateur principal (regroupe les autres stacks).
- **types.ts** : Types et interfaces liés à la navigation.

## Schéma de navigation
```
AppNavigator
├── AuthNavigator
│   └── LoginScreen
├── MainNavigator
│   ├── HomeScreen
│   └── SettingsScreen
```

## Ajouter une route
1. Créer le nouvel écran dans `screens/`.
2. L’ajouter au bon navigateur (`AppNavigator.tsx` ou autre).
3. Déclarer le type dans `types.ts` si nécessaire.
4. Documenter la modification ici.

## Dépendances
- Utilise `react-navigation`.
- Voir la documentation officielle : https://reactnavigation.org/

## Exemple d’utilisation
```tsx
import { NavigationContainer } from '@react-navigation/native';
```

## Auteurs
- Equipe ApexTime
