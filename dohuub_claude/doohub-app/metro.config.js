/**
 * Workspace-root Metro config.
 * EAS Build (monorepo) runs from the workspace root (doohub-app/).
 * We must tell Metro that the Expo app lives in apps/mobile/ so
 * expo-router can find the route files in apps/mobile/app/.
 */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const workspaceRoot = __dirname;
const projectRoot = path.resolve(workspaceRoot, 'apps/mobile');

const config = getDefaultConfig(projectRoot);

// Watch the full workspace so cross-package imports resolve
config.watchFolders = [workspaceRoot];

// Resolve packages from the app-local node_modules first,
// then fall back to the hoisted workspace node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Keep the .mjs extension support that the app metro config adds
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
