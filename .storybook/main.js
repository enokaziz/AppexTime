module.exports = {
  stories: ['../src/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-native',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@components': path.resolve(__dirname, '../src/components'),
          '@hooks': path.resolve(__dirname, '../src/hooks'),
          '@styles': path.resolve(__dirname, '../src/styles'),
          '@types': path.resolve(__dirname, '../src/types'),
        },
      },
    };
  },
};
