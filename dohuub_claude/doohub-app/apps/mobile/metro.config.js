const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Monorepo setup: this app lives in doohub-app/apps/mobile/
// The workspace root (doohub-app/) may have hoisted packages in its node_modules.
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the full workspace so cross-package imports resolve
config.watchFolders = [workspaceRoot];

// Resolve packages from the app-local node_modules first,
// then fall back to the hoisted workspace node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
