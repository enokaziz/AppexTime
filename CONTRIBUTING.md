# Contribuer à ApexTime

Merci de votre intérêt pour contribuer à ApexTime !

## Pré-requis
- Node.js >= 18.x
- npm >= 9.x ou yarn
- Cloner le dépôt et installer les dépendances :
  ```bash
  git clone https://github.com/votre-repo/apextime.git
  cd apextime
  npm install
  ```

## Workflow de Contribution
1. Forkez le projet
2. Créez une branche à partir de `main` (`feature/ma-fonctionnalite`)
3. Commitez vos modifications (voir format de commit ci-dessous)
4. Poussez votre branche sur votre fork
5. Ouvrez une Pull Request sur le repo principal

## Format de Commit (Conventional Commits)
- `feat: nouvelle fonctionnalité`
- `fix: correction de bug`
- `docs: documentation`
- `style: formatage, indentation, etc.`
- `refactor: refactoring du code sans ajout de fonctionnalité`
- `test: ajout ou correction de tests`
- `chore: tâches diverses (build, outils, etc.)`

Exemple :
```
feat: ajout du module de gestion des absences
```

## Pull Requests
- Assurez-vous que votre code est bien formaté (Prettier, ESLint) et passe les tests (Jest).
- Ajoutez des tests pour toute nouvelle fonctionnalité.
- Mettez à jour la documentation si nécessaire (README, commentaires).
- Suivez le format de commit ci-dessus.

## Code Style
- Utilisez [Prettier](https://prettier.io/) pour le formatage du code.
- Respectez les règles [ESLint](https://eslint.org/).
- Commande utile :
  ```bash
  npm run lint
  npm run format
  ```

## Testing
- Utilisez [Jest](https://jestjs.io/) pour écrire des tests unitaires.
- Commande pour lancer les tests :
  ```bash
  npm test
  ```
- Assurez-vous que tous les tests passent avant de soumettre une pull request.

## Documentation
- Mettez à jour le `README.md` si nécessaire.
- Ajoutez des commentaires dans le code pour expliquer les parties complexes.

## Reporting Issues
- Utilisez le template de rapport d'issue pour signaler des bugs ou des améliorations.
- Fournissez des détails clairs et concis sur le problème.

## Code de conduite
En contribuant, vous acceptez le [Code de Conduite](CODE_OF_CONDUCT.md) du projet.

## FAQ Contributeur
- **Q : Que faire si un test échoue ?**
  - R : Corrigez le code ou le test, relancez `npm test`.
- **Q : Qui contacter pour une question ?**
  - R : Ouvrez une issue ou contactez l'équipe via Discord/GitHub.

## License
En contribuant à ce projet, vous acceptez que vos contributions soient utilisées sous la licence MIT.
