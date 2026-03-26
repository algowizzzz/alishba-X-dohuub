const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo support - watch the workspace root
config.watchFolders = [workspaceRoot];

// Resolve modules from project root first, then workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Enable web support
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
