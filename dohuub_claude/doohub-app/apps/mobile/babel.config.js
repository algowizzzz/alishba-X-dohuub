module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['transform-inline-environment-variables', {
        include: [
          'EXPO_ROUTER_APP_ROOT',
          'EXPO_ROUTER_IMPORT_MODE',
          'EXPO_PUBLIC_SUPABASE_URL',
          'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        ],
      }],
    ],
  };
};
