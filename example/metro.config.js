const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const modules = Object.keys({
  ...pak.peerDependencies,
});

/**
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    disableHierarchicalLookup: true,
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    blockList: exclusionList([
      ...modules.map(
        (moduleName) =>
          new RegExp(
            `^${escape(path.join(workspaceRoot, 'node_modules', moduleName))}\\/.*$`
          )
      ),
      new RegExp(
        `^${escape(path.join(projectRoot, 'node_modules', pak.name))}\\/.*$`
      ),
    ]),
    extraNodeModules: modules.reduce(
      (acc, moduleName) => {
        acc[moduleName] = path.join(projectRoot, 'node_modules', moduleName);
        return acc;
      },
      { [pak.name]: workspaceRoot }
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
