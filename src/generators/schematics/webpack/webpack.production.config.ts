export const productionWebpack = `const webpack = require('./webpack.config');
const { execSync } = require('child_process');

execSync('tsc ./src/environments/environment.prod.ts');
const environment = require('./src/environments/environment.prod').environment;

webpack.output.publicPath = environment[webpack.output.uniqueName];

if (environment.remotes) {
	webpack.plugins[0].remotes = { ...environment.remote };
}

if (environment.exposes) {
	webpack.plugins[0].exposes = { ...environment.exposes };
}

module.exports = webpack;
`;
