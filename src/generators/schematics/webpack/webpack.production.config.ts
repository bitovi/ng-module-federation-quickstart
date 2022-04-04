export const productionWebpack = `const webpack = require('./webpack.config');
const { execSync } = require('child_process');

const envPath = path.resolve(
	path.join(__dirname, '/src/environments/environment.ts'),
);

try {
	execSync(\`tsc $\{envPath\}\`, { stdio: null });
} catch (e) {}

const environment = require('./src/environments/environment').environment;

webpack.output.publicPath = environment[webpack.output.uniqueName];

if (environment.remotes) {
	webpack.plugins[0].remotes = { ...environment.remote };
}

if (environment.exposes) {
	webpack.plugins[0].exposes = { ...environment.exposes };
}

module.exports = webpack;
`;
