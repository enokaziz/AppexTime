# ApexTime - Application de Gestion des Temps et Absences

![MIT License](https://img.shields.io/badge/license-MIT-green.svg)
![Expo](https://img.shields.io/badge/expo-%5E48.0.0-blue)
![Made with React Native](https://img.shields.io/badge/React%20Native-0.72+-blue)
![Build](https://github.com/votre-repo/apextime/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/votre-repo/apextime/branch/main/graph/badge.svg)
![Node](https://img.shields.io/badge/node-%3E=18.x-brightgreen)
[![Discord](https://img.shields.io/discord/123456789012345678.svg?label=Discord&logo=discord&color=7289DA)](https://discord.gg/votre-invite)
[![Releases](https://img.shields.io/github/v/release/votre-repo/apextime)](https://github.com/votre-repo/apextime/releases)
[![Roadmap](https://img.shields.io/badge/roadmap-projects-blue)](https://github.com/votre-repo/apextime/projects)

Application mobile complète pour la gestion des temps de travail, congés et absences, destinée aux employés et administrateurs.

---

<p align="center">
  <img src="docs/demo-apextime.gif" alt="Démo ApexTime" width="350"/>
</p>

## Table des Matières
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Configuration Requise](#configuration-requise)
- [Installation](#installation)
- [Structure du Projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Commandes Utiles](#commandes-utiles)
- [Captures d'Écran](#captures-décran)
- [Contribution](#contribution)
- [FAQ](#faq)
- [Contact](#contact)
- [Licence](#licence)
- [Liens Utiles](#liens-utiles)

---

## Fonctionnalités
- **Gestion des temps de travail** : Suivi des heures travaillées, pointage, heures supplémentaires
- **Gestion des absences** : Demande, validation et historique des congés
- **Tableaux de bord** : Statistiques, analyses et rapports pour les admins et managers
- **Notifications** : Alertes pour les approbations, rappels de pointage
- **Synchronisation cloud** : Sauvegarde et accès sécurisé aux données
- **Support intégré** : Chat, FAQ, base de connaissances, assistance
- **Reconnaissance faciale** : Pointage par reconnaissance biométrique (optionnel)

## Technologies
- **Framework** : React Native + Expo
- **Navigation** : React Navigation
- **State Management** : Redux Toolkit
- **Base de données** : Firebase (Firestore)
- **Notifications** : Expo Notifications
- **UI** : React Native Paper, SVG
- **Tests** : Jest, Testing Library

---
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
Créer un fichier .env à la racine avec vos clés Firebase :
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
# etc.
```

## Utilisation

```bash
# Démarrer en mode développement
npm start

# Lancer sur Android
devices Android connectés ou émulateur
npm run android

# Lancer sur iOS
(simulateur Mac uniquement)
npm run ios

# Lancer sur le Web
npm run web
```

## Structure du Projet

```
src/
├── assets/        # Ressources statiques (images, icônes, polices)
├── components/    # Composants réutilisables
├── config/        # Configuration
├── contexts/      # Contextes React
├── hooks/         # Hooks personnalisés
├── middlewares/   # Middlewares Redux ou métiers
├── navigation/    # Configuration de navigation
├── screens/       # Écrans de l'application
├── services/      # Services API et logique métier
├── store/         # Configuration Redux
├── styles/        # Styles globaux
├── types/         # Définitions TypeScript
└── utils/         # Utilitaires
```

## Captures d'Écran

> ![Aperçu mobile](./docs/screenshot1.png)
> ![Tableau de bord](./docs/screenshot2.png)
> *(Ajoutez vos propres captures dans `docs/`)*

### Générer automatiquement des captures d'écran avec Expo

Vous pouvez utiliser la commande suivante pour générer des screenshots sur différents appareils :

```bash
expo export:web && npx expo-screenshots --platform android,ios,web --output docs/
```

- Pour Android/iOS, utilisez un émulateur ou un device connecté.
- Les captures générées seront placées dans le dossier `docs/`.
- Plus d'infos : [expo-screenshots](https://github.com/expo/expo-screenshots)

## Contribution

Les contributions sont les bienvenues !
- Forkez le projet
- Créez une branche (`feature/ma-fonctionnalite`)
- Commitez vos modifications
- Ouvrez une Pull Request

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## FAQ

**Q : Comment configurer Firebase ?**
R : Suivez la section Installation et renseignez toutes les variables dans `.env`.

**Q : Comment ajouter un nouvel écran ?**
R : Créez le composant dans `src/screens/` et ajoutez la route dans `src/navigation/`.

**Q : L’application fonctionne-t-elle hors-ligne ?**
R : Oui, certaines fonctionnalités sont accessibles hors-ligne, la synchronisation se fait au retour du réseau.

## Contact

Pour toute question ou support :
- Email : support@apextime.com
- Github Issues : [github.com/votre-repo/apextime/issues](https://github.com/votre-repo/apextime/issues)

## Licence

Ce projet est sous licence MIT - voir [LICENSE](LICENSE) pour plus de détails.

## Liens Utiles

- [Documentation React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase](https://firebase.google.com/docs)

---

Merci d’utiliser ApexTime ! 🚀