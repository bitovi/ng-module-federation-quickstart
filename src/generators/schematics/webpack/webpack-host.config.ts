export const webpackHostConfigTemplate = `const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
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
	/\\{[\\n\\s\\t\\=\\"\\'\\:A-Z\\{@\\/\\:0-9\\,\\.]+\\}/gi,
)[0];
const environment = eval(\`(() => { return \$\{environmentText\}})()\`);

const workspaceRootPath = path.join(__dirname, 'tsconfig.app.json');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(workspaceRootPath);

module.exports = {
	output: {
		uniqueName: '{{projectName}}',
		publicPath: environment.{{projectName}} || 'auto',
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
				...environment.remote
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
