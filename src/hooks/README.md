# Hooks personnalisés

Ce dossier contient les hooks personnalisés React utilisés pour la logique métier réutilisable dans l’application ApexTime (authentification, gestion des tâches, support, etc.).

## Fichiers

- **useAnimatedValue.ts** : Hook pour gérer des valeurs animées.
- **useAppDispatch.ts** : Hook personnalisé pour dispatcher des actions Redux.
- **useAppSelector.ts** : Hook personnalisé pour sélectionner des états Redux.
- ...

## Exemple d’utilisation
```tsx
import { useAuth } from './useAuth';
const { user, login } = useAuth();
```

## Créer un nouveau hook
1. Créer un fichier `useMonHook.ts`.
2. Utiliser le préfixe `use` pour tous les hooks.
3. Documenter le hook dans ce README.

## Conseils
- Écrire des tests unitaires pour chaque hook.
- Privilégier la réutilisabilité et la simplicité.
- Documenter les paramètres et les valeurs de retour.

## Auteurs
- Equipe ApexTime
