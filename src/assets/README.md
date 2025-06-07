# Ressources statiques

Ce dossier contient toutes les ressources statiques de l’application ApexTime, telles que les images, icônes, polices et autres fichiers utilisés pour l’affichage.

## Structure typique

```
assets/
├── images/
│   ├── logo.png
│   └── background.jpg
├── icons/
│   └── app-icon.svg
├── fonts/
│   └── Roboto-Regular.ttf
```

## Conventions
- Privilégier les noms explicites et en anglais (ex : `login-background.jpg`).
- Organiser par type (images, icônes, polices, etc.).
- Optimiser les images avant ajout (taille, format).

## Ajouter une ressource
1. Placer le fichier dans le sous-dossier approprié.
2. Mettre à jour ce README si besoin (ex : conventions, exemples).
3. Vérifier le bon chargement dans l’application.

## Utilisation
Exemple d’import dans le code :
```js
import logo from '../assets/images/logo.png';
```

## Auteurs
- Equipe ApexTime
