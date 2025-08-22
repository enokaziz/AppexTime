# Contextes React

Ce dossier contient les contextes React utilisés pour partager des états spécifiques à un domaine dans l’application ApexTime.

Suite à la refactorisation, la **gestion de l'état global** (comme l'authentification) est maintenant gérée par **Redux**. Les contextes restants sont utilisés pour des états qui ne nécessitent pas Redux, comme la gestion du thème ou des données très localisées.

## Fichiers

- **BenefitsContext.tsx** : Contexte pour la gestion des avantages employés.
- **EmployeeContext.tsx** : Contexte pour la gestion des employés.
- **HistoryContext.tsx** : Contexte pour l’historique des actions/utilisateurs.
- **LeaveContext.tsx** : Contexte pour la gestion des congés.
- **SettingsContext.tsx** : Contexte pour les paramètres de l’application.
- **SupportContext.tsx** : Contexte pour le support et l’assistance.
- **TaskContext.tsx** : Contexte pour la gestion des tâches.
- **ThemeContext.tsx** : Contexte pour la gestion du thème (clair/sombre).

## Bonnes pratiques
- Garder les contextes simples et spécifiques à un domaine.
- Éviter de stocker des états volumineux ou qui changent fréquemment (préférer Redux pour cela).
- Toujours typer les valeurs du contexte.

## Auteurs
- Equipe ApexTime