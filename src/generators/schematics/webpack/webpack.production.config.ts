export const productionWebpack = `const webpack = require('./webpack.config');
const fs = require('fs');
const path = require('path');

const environmentPath = path.join(
	__dirname,
	'src/environments/environment.prod.ts',
);
const environmentFile = fs
	.readFileSync(environmentPath)
	.toString()
	.replace(/export/, '');
const environmentText = environmentFile.match(
	/\\{[\\n\\s\\t\\=\\"\\'\\:A-Z\\{@\\/\\:0-9\\,\\.]+\\}/gi,
)[0];
const environment = eval(\`(() => { return \${environmentText}})()\`);

webpack.output.publicPath = environment[webpack.output.uniqueName]

if(environment.remote) {
  webpack.plugins[0].remotes = { ...environment.remote };
}

if(environment.exposes) {
  webpack.plugins[0].exposes = { ...environment.exposes };
}


module.exports = webpack;
`;
