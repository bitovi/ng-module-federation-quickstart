import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addRemote } from './add-remote';
import { generateWebpackConfig, productionWebpack } from '../webpack';
import {
  addPropertyToObjectString,
  getAllNameConventions,
  getAngularConfig,
  INameConventions,
  objectPattern,
  toCamelCase,
} from '../../../core';
import { format } from 'prettier';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function bitovi(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const projectNames: INameConventions = getAllNameConventions(_options.projectName || '');

    // if port exists, is remote app
    // add webpack config for module federation
    if (_options.port && _options.addRemote) {
      // add remotes to host
      const remoteAdded = addRemote(tree, _options);

      return remoteAdded;
    }

    // add webpack remote config
    if (_options.port && !_options.host) {
      tree.create(
        'webpack.config.js',
        generateWebpackConfig({
          port: _options.port,
          projectName: _options.projectName,
        })
      );
    }

    // add webpack host config
    if (_options.host) {
      tree.create(
        'webpack.config.js',
        generateWebpackConfig({ port: 4200, projectName: projectNames.camel }, true)
      );
    }

    // add webpack prod config
    tree.create('webpack.prod.config.js', productionWebpack);
    // bootstrap main code
    const mainContent: string = tree.get('src/main.ts').content.toString();
    const bootstrapContent = `import('./bootstrap').catch((err) => console.error(err));`;

    // create bootstrap.ts with the same code as main.ts
    tree.create('src/bootstrap.ts', mainContent);
    // call bootstrap from main
    tree.overwrite('src/main.ts', bootstrapContent);

    tree = updateEnvironment(tree, projectNames.camel);

    // removes package.json, .vscode, .gitignore and .editorconfig
    // those files are no needed
    tree = removeNoNeededFiles(tree);
    // gets angular.json and sets our webpack config as the webpack config to
    tree = useCustomWebpack(tree, projectNames.kebab);

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

function useCustomWebpack(tree: Tree, projectName: string): Tree {
  const angularConfig = getAngularConfig(tree);
  const customProdWebpackConfig = {
    path: './webpack.prod.config.js',
    replaceDuplicatePlugins: true,
  };
  const customDevWebpackConfig = {
    path: './webpack.prod.config.js',
    replaceDuplicatePlugins: true,
  };

  angularConfig.projects[projectName].architect.build.options.customWebpackConfig = {
    path: './webpack.prod.config.js',
    replaceDuplicatePlugins: true,
  };
  angularConfig.projects[
    projectName
  ].architect.build.configurations.production.customWebpackConfig = customProdWebpackConfig;
  angularConfig.projects[
    projectName
  ].architect.build.configurations.development.customWebpackConfig = customDevWebpackConfig;

  angularConfig.projects[projectName].architect.build.builder =
    '@angular-builders/custom-webpack:browser';

  angularConfig.projects[projectName].architect.serve.configurations.extraWebpackConfig = {
    path: './webpack.config.js',
  };
  angularConfig.projects[projectName].architect.serve.builder =
    '@angular-builders/custom-webpack:dev-server';

  tree.overwrite('angular.json', format(JSON.stringify(angularConfig), { parser: 'json' }));
  return tree;
}

function updateEnvironment(tree: Tree, projectName: string) {
  const devEnvPath = 'src/environments/environment.ts';
  const prodEnvPat = 'src/environments/environment.prod.ts';

  const devEnvironment: string = tree.get(devEnvPath).content.toString();
  const prodEnvironment: string = tree.get(prodEnvPat).content.toString();

  const newRoute = `${projectName} : 'auto'`;
  const newDevEnvironment = addPropertyToObjectString(devEnvironment, newRoute);
  const newProdEnvironment = addPropertyToObjectString(prodEnvironment, newRoute);

  tree.overwrite(
    devEnvPath,
    format(devEnvironment.replace(objectPattern, newDevEnvironment), { parser: 'babel' })
  );
  tree.overwrite(
    prodEnvPat,
    format(prodEnvironment.replace(objectPattern, newProdEnvironment), { parser: 'babel' })
  );

  return tree;
}
