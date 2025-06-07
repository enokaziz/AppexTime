// ESLint configuration for ApexTime
// Docs: https://eslint.org/docs/latest/user-guide/configuring

module.exports = {
  // Définition des environnements globaux
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // Extensions de règles recommandées
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Pas nécessaire avec React 17+
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/'], // Exclure les fichiers/dossiers générés
};

// Conseil : Ajoutez un script dans package.json :
// "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
