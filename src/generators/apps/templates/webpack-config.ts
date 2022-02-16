export const webPackConfig = `const tsConfigPath =
process.env.NX_TSCONFIG_PATH ??
path.join(__dirname, '../../tsconfig.base.json');

const workspaceRootPath = path.join(__dirname, '../../');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
tsConfigPath,
[
  /* mapped paths to share */
  '@ng-mfe/shared/data-access-user',
],
workspaceRootPath
);

module.exports = {
output: {
  uniqueName: 'dashboard',
  publicPath: 'auto',
},
optimization: {
  runtimeChunk: false,
},
experiments: {
  outputModule: true,
},
resolve: {
  alias: {
    ...sharedMappings.getAliases(),
  },
},
plugins: [
  new ModuleFederationPlugin({
    remotes: {
      login: 'http://localhost:4201/remoteEntry.js',
      products: 'http://localhost:4202/remoteEntry.js',
    },
    shared: share({
      '@angular/core': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/common': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/common/http': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/router': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@ngrx/store': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      rxjs: {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      ...sharedMappings.getDescriptors(),
    }),
    library: {
      type: 'module',
    },
  }),
  sharedMappings.getPlugin(),
],
};
`;
