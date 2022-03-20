import { Tree } from '@angular-devkit/schematics';

export function getAngularConfig(tree: Tree): any {
  const angularConfig = tree.get('angular.json').content.toString();

  return JSON.parse(angularConfig);
}
