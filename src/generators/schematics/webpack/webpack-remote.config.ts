export const webpackRemoteConfigTemplate = `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const tsConfigPath = path.join(__dirname, '../../tsconfig.base.json');

const workspaceRootPath = path.join(__dirname, 'tsconfig.app.json');
const sharedMappings = new mf.SharedMappings();

sharedMappings.register(workspaceRootPath);

module.exports = {
	output: {
		uniqueName: '{{projectName}}',
		publicPath: 'auto',
		scriptType: 'module',
	},
	optimization: {
		runtimeChunk: false,
	},
	resolve: {
		alias: {
			...sharedMappings.getAliases(),
		},
	},
	experiments: {
		outputModule: true,
	},
	plugins: [
		new ModuleFederationPlugin({
			name: '{{projectName}}',
			filename: 'remoteEntry.js',
			library: { type: 'module' },
			exposes: {
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
				rxjs: {
					singleton: true,
					strictVersion: true,
					requiredVersion: 'auto',
					includeSecondaries: true,
				},
				...sharedMappings.getDescriptors(),
			}),
		}),
		sharedMappings.getPlugin(),
	],
};`;
