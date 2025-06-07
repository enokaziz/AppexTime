# Contextes React

Ce dossier contient les contextes React utilisés pour partager des états globaux dans l’application ApexTime (authentification, thème, tâches, support, etc.).

## Fichiers

- **AuthContext.tsx** : Contexte pour la gestion de l’authentification.
- **BenefitsContext.tsx** : Contexte pour la gestion des avantages employés.
- **EmployeeContext.tsx** : Contexte pour la gestion des employés.
- **HistoryContext.tsx** : Contexte pour l’historique des actions/utilisateurs.
- **LeaveContext.tsx** : Contexte pour la gestion des congés.
- **SettingsContext.tsx** : Contexte pour les paramètres de l’application.
- **SupportContext.tsx** : Contexte pour le support et l’assistance.
- **TaskContext.tsx** : Contexte pour la gestion des tâches.
- **ThemeContext.tsx** : Contexte pour la gestion du thème (clair/sombre).

## Exemple d’utilisation
```tsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
const { user } = useContext(AuthContext);
```

## Créer un nouveau contexte
1. Créer un fichier `MonContexte.tsx`.
2. Utiliser `createContext` et `useContext` de React.
3. Documenter le contexte dans ce README.

## Bonnes pratiques
- Garder les contextes simples et spécifiques à un domaine.
- Éviter de stocker des états volumineux ou rarement modifiés.
- Toujours typer les valeurs du contexte.

## Auteurs
- Equipe ApexTime
