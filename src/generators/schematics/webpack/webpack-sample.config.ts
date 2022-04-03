export const webpackSampleConfigTemplate = `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { spawnSync } = require('child_process');
const share = mf.share;

spawnSync('tsc ./src/environments/environment.ts');
const environment = require('./src/environments/environment').environment;

const workspaceRootPath = path.join(__dirname, 'tsconfig.app.json');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(workspaceRootPath);

module.exports = {
	output: {
		uniqueName: 'newProject',
		publicPath: environment.newProject || 'auto',
	},
	optimization: {
		runtimeChunk: false,
	},
	resolve: {
		alias: {
			...sharedMappings.getAliases(),
		},
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'newProject',
			remotes: {
				...environment.remotes,
			},
			exposes: { 
				...environment.exposes 
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
			}),
		}),
		sharedMappings.getPlugin(),
	],
};
`;
