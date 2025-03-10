module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        //'react-native-reanimated/plugin', 
        ['module:react-native-dotenv',{
          'moduleName': '@env',
          'path': '.env',
          'blacklist': null,
          'whitelist': null,
          'safe': false,
          'allowUndefined': true
        }],
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@components': './src/components',
              '@screens': './src/screens',
              '@services': './src/services',
              '@styles': './src/styles',
              '@utils': './src/utils',
              '@config': './src/config',
              '@contexts': './src/contexts',
              '@hooks': './src/hooks',
              '@navigation': './src/navigation',
              '@types': './src/types',
            },
          },
        ],
      ],
    };
  };