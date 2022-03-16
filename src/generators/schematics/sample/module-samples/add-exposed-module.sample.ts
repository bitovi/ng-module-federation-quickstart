import { Tree } from '@angular-devkit/schematics';
import { exposesPattern, objectPattern } from '../../../../core';
import { format } from 'prettier';

export function addExposedModule(tree: Tree, exposedModule: string, exposedModulePath): Tree {
  const webpackConfig = tree.get('webpack.config.js').content.toString();
  const exposedModules = webpackConfig.match(exposesPattern)[0];
  const exposedArray = exposedModules
    .match(objectPattern)[0]
    .replace(/[\{\}\n\s\t]/g, '')
    .split(',')
    .filter((value: string) => value.length);

  const newExposedModule = `${exposedModule}: "${exposedModulePath}"`;
  const newExposedObject = `exposes: {${[...exposedArray, newExposedModule].join(',')}}`;

  tree.overwrite(
    'webpack.config.js',
    format(webpackConfig.replace(exposesPattern, newExposedObject), { parser: 'babel' })
  );

  return tree;
}
