import {
	externalSchematic,
	Rule,
	SchematicContext,
	Tree,
} from '@angular-devkit/schematics';
import { generateWebpackConfig } from './webpack';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function bitovi(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (_options.port) {
			tree.create('webpack.config.js', generateWebpackConfig(_options.port));
		}

		return tree;
	};
}
