const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

// API calls go directly to http://YOUR_LAN_IP:3002/api (see src/utils/network-config.ts).
// Expo SDK 54 does not support Metro /api proxy on port 8081.

module.exports = config;
