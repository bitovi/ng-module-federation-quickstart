export const webpackRemoteConfigTemplate = `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;
const fs = require('fs');

const environmentPath = path.join(__dirname, 'src/environments/environment.ts');
const environmentFile = fs
	.readFileSync(environmentPath)
	.toString()
	.replace(/export/, '');
const environmentText = environmentFile.match(
	/\\{[\\n\\s\\t\\=\\"\\'\\:A-Z\\{@\\/\\:0-9\\,\\.\\}]+\\}/gi,
)[0];
const environment = eval(\`(() => { return \$\{environmentText\}})()\`);

const workspaceRootPath = path.join(__dirname, 'tsconfig.app.json');
const sharedMappings = new mf.SharedMappings();

sharedMappings.register(workspaceRootPath);

module.exports = {
	output: {
		uniqueName: '{{projectNameVariable}}',
		publicPath: environment.{{projectNameVariable}} || 'auto',
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
				...sharedMappings.getDescriptors(),
			}),
		}),
		sharedMappings.getPlugin(),
	],
};`;
