export const webpackSampleConfigTemplate = (isHost = true) => {
  return `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { execSync } = require('child_process');
const share = mf.share;

const envPath = path.resolve(
	path.join(__dirname, '/src/environments/environment.ts'),
);

try {
	execSync(\`tsc $\{envPath\}\`, { stdio: null });
} catch (e) {}

const environment = require('./src/environments/environment').environment;

const workspaceRootPath = path.join(__dirname, 'tsconfig.app.json');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(workspaceRootPath);

module.exports = {
	output: {
		uniqueName: '{{projectNameVariable}}',
		publicPath: environment.{{projectNameVariable}} || 'auto',
	},
	optimization: {
		runtimeChunk: false,
	},
	resolve: {
		alias: {
			...sharedMappings.getAliases(),
		},
	},
	${!isHost ? 'experiments: {outputModule: true,},' : ''}
	plugins: [
		new ModuleFederationPlugin({
			name: '{{projectNameVariable}}',
			${!isHost ? "filename: 'remoteEntry.js',\nlibrary: { type: 'module' }," : ''}
			${isHost ? 'remotes: {...environment.remotes,},' : 'exposes: {...environment.exposes },'}
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
				rxjs: {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
					includeSecondaries: true,
				},
			}),
		}),
		sharedMappings.getPlugin(),
	],
};
`;
};
