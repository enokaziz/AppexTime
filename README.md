# ApexTime - Application de Gestion des Temps et Absences

Application mobile de gestion des temps de travail, congés et absences pour les employés et administrateurs.

## Fonctionnalités Principales

- **Gestion des temps de travail** : Suivi des heures travaillées
- **Gestion des absences** : Demande et validation des congés
- **Tableau de bord admin** : Statistiques et analyses
- **Notifications** : Alertes pour les approbations
- **Synchronisation cloud** : Sauvegarde sécurisée des données

## Technologies Utilisées

- **Framework** : React Native + Expo
- **Navigation** : React Navigation
- **State Management** : Redux Toolkit
- **Base de données** : Firebase (Firestore)
- **UI** : React Native Paper + SVG
- **Formulaires** : Formik + Yup

## Configuration Requise

- Node.js v18+
- Expo CLI
- Android Studio / Xcode (pour le développement natif)

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-repo/apextime.git

# Installer les dépendances
cd apextime
npm install

# Configurer Firebase
Créer un fichier .env à la racine avec vos clés Firebase
```

## Lancer l'Application

```bash
# Développement
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Structure du Projet

```
src/
├── components/    # Composants réutilisables
├── config/        # Configuration
├── contexts/      # Contextes React
├── hooks/         # Hooks personnalisés
├── navigation/    # Configuration de navigation
├── screens/       # Écrans de l'application
├── services/      # Services API
├── store/         # Configuration Redux
├── styles/        # Styles globaux
├── types/         # Définitions TypeScript
└── utils/         # Utilitaires
```

## Captures d'Écran

(À ajouter)

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines de contribution.

## Licence

Ce projet est sous licence MIT - voir [LICENSE](LICENSE) pour plus de détails.