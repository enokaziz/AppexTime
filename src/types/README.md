# Types et interfaces

Ce dossier regroupe les fichiers de types et interfaces TypeScript utilisés dans l’application ApexTime (définitions pour l’authentification, les employés, les permissions, etc.).

## Fichiers

- **Permissions.ts** : Définitions des rôles et permissions utilisateurs.
- **auth.ts** : Types liés à l’authentification.
- **employee.ts** : Types liés aux employés.
- **hooks.d.ts** : Déclarations de types pour les hooks personnalisés.
- **index.ts** : Point d’entrée pour exporter les types.
- **qrcode.d.ts** : Déclarations de types pour la génération de QR codes.
- **react-native-dotenv.d.ts** : Déclarations de types pour l’utilisation des variables d’environnement.

## Exemple de type
```ts
export type Employee = {
  id: string;
  name: string;
  role: string;
};
```

## Conventions
- Utiliser des noms explicites et en PascalCase.
- Grouper les types par domaine fonctionnel.
- Documenter chaque type complexe.

## Organisation
- Utiliser un fichier `index.ts` pour centraliser les exports.
- Préférer des fichiers courts et spécialisés.

## Conseils
- Mettre à jour ce README à chaque ajout de type majeur.
- Privilégier la réutilisation des types communs.

## Auteurs
- Equipe ApexTime
