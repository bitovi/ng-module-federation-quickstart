import { Tree } from '@angular-devkit/schematics';
import {
  getAllNameConventions,
  INameConventions,
  objectPattern,
  parseToObject,
} from '../../../core';
import { format } from 'prettier';

const devEnvPath = 'src/environments/environment.ts';
const prodEnvPat = 'src/environments/environment.prod.ts';

export function addRemote(tree: Tree, _options: any): Tree {
  const devEnvironment: string = tree.get(devEnvPath).content.toString();
  const prodEnvironment: string = tree.get(prodEnvPat).content.toString();
  const newRoute = `http://localhost:${_options.port}/remoteEntry.js`;
  const projectNames: INameConventions = getAllNameConventions(_options.projectName);

  const newDevEnvironment = parseToObject(devEnvironment.match(objectPattern)[0]);
  if (!newDevEnvironment.remotes) {
    newDevEnvironment.remotes = {
      [projectNames.camel]: newRoute,
    };
  } else {
    newDevEnvironment.remotes[projectNames.camel] = newRoute;
  }

  const newProdEnvironment = parseToObject(prodEnvironment.match(objectPattern)[0]);
  if (!newProdEnvironment.remotes) {
    newProdEnvironment.remotes = {
      [projectNames.camel]: newRoute,
    };
  } else {
    newProdEnvironment.remotes[projectNames.camel] = newRoute;
  }

  // overwrite environment
  tree.overwrite(
    devEnvPath,
    format(devEnvironment.replace(objectPattern, JSON.stringify(newDevEnvironment)), {
      parser: 'babel',
    })
  );
  tree.overwrite(
    prodEnvPat,
    format(prodEnvironment.replace(objectPattern, JSON.stringify(newProdEnvironment)), {
      parser: 'babel',
    })
  );

  // add remote module declarations
  const moduleDeclaration = `declare module '${projectNames.camel}/Module';`;

  if (tree.exists('src/decl.d.ts')) {
    let oldDeclarations = tree.get('src/decl.d.ts').content.toString();
    oldDeclarations += `\n ${moduleDeclaration}`;
    tree.overwrite('src/decl.d.ts', oldDeclarations);
  } else {
    tree.create('src/decl.d.ts', moduleDeclaration);
  }

  return tree;
}
