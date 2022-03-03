export const webpackHostConfigTemplate = `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
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
			name: '{{projectName}}',
			remotes: {
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
