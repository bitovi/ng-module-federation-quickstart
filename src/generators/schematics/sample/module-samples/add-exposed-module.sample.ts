import { Tree } from '@angular-devkit/schematics';
import { objectPattern, parseToObject } from '../../../../core';
import { format } from 'prettier';

export function addExposedModule(tree: Tree, exposedModule: string, exposedModulePath): Tree {
  const environmentPaths = [
    'src/environments/environment.ts',
    'src/environments/environment.prod.ts',
  ];

  for (const environmentPath of environmentPaths) {
    const environmentConfig = tree.get(environmentPath).content.toString();

    const newEnvironmentConfig = parseToObject(environmentConfig.match(objectPattern)[0]);
    if (!newEnvironmentConfig.exposes) {
      newEnvironmentConfig.exposes = {
        [exposedModule]: exposedModulePath,
      };
    } else {
      newEnvironmentConfig.exposes[exposedModule] = exposedModulePath;
    }

    tree.overwrite(
      environmentPath,
      format(environmentConfig.replace(objectPattern, JSON.stringify(newEnvironmentConfig)), {
        parser: 'babel',
      })
    );
  }

  return tree;
}
