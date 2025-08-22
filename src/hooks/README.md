# Hooks personnalisés

Ce dossier contient les hooks personnalisés React utilisés pour la logique métier réutilisable dans l’application ApexTime.

## Fichiers

- **useAnimatedValue.ts** : Hook pour gérer des valeurs animées.
- **useAppDispatch.ts** : Hook personnalisé pour dispatcher des actions Redux.
- **useAppSelector.ts** : Hook personnalisé pour sélectionner des états Redux.
- ... (et autres hooks spécifiques à un domaine)

## Exemple d’utilisation (avec Redux)
```tsx
import { useAppSelector, useAppDispatch } from './hooks';
import { loginUser } from '../store/slices/authSlice';

const MonComposant = () => {
  const { user, loading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(loginUser({ email: '...', password: '...' }));
  }
  // ...
}
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