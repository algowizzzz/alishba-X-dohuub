module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // DO NOT add EXPO_ROUTER_APP_ROOT or EXPO_ROUTER_IMPORT_MODE here.
    // babel-preset-expo must process them FIRST (via its own plugin) to
    // convert require.context(process.env.EXPO_ROUTER_APP_ROOT) into an
    // absolute path before any inline substitution occurs. If we replace
    // them with a bare string ("app") here, expo-router's babel plugin
    // never sees the pattern and Metro looks in the wrong directory.
    ['transform-inline-environment-variables', {
        include: [
          'EXPO_PUBLIC_SUPABASE_URL',
          'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        ],
      }],
    ],
  };
};
