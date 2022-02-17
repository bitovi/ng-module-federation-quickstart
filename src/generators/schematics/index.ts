import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { generateWebpackConfig } from './webpack';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function bitovi(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		// if port exists, is remote app
		// add webpack config for module federation

		if (_options.port) {
			tree.create(
				'webpack.config.js',
				generateWebpackConfig({
					port: _options.port,
					projectName: _options.projectName,
				}),
			);
		}

		if (_options.host) {
			tree.create(
				'webpack.config.js',
				generateWebpackConfig(
					{ port: 4200, projectName: _options.projectName },
					true,
				),
			);
		}

		// add webpack prod config
		tree.create(
			'webpack.prod.config.js',
			"module.exports = require('./webpack.config')",
		);

		tree = removeNoNeededFiles(tree);

		return tree;
	};
}

function removeNoNeededFiles(tree: Tree): Tree {
	tree.delete('package.json');
	tree.delete('.vscode');
	tree.delete('.gitignore');
	tree.delete('.editorconfig');

	return tree;
}
