import { Tree } from '@angular-devkit/schematics';
import { objectPattern, parseToObject, parseToString, remotesPattern } from '../../../core';
import { format } from 'prettier';

const devEnvPath = 'src/environments/environment.ts';
const prodEnvPat = 'src/environments/environment.prod.ts';

export function addRemote(tree: Tree, _options: any): Tree {
  let webpackConfig = tree.get('webpack.config.js').content.toString();
  const remotes: string = webpackConfig
    .match(remotesPattern)[0]
    .replace(/remotes[\s\t\n]{0,}:/, '')
    .replace(/[\n\s\t\{\}]/g, '');

  const devEnvironment: string = tree.get(devEnvPath).content.toString();
  const prodEnvironment: string = tree.get(prodEnvPat).content.toString();
  const newRoute = `${_options.projectName}: 'http://localhost:${_options.port}/remoteEntry.js'`;

  const newDevEnvironment = `{${[
    ...devEnvironment
      .match(objectPattern)[0]
      .replace(/[\n\t]/g, '')
      .slice(1, -1)
      .split(','),
    newRoute,
  ]
    .filter((value) => value.length > 0)
    .join(',\n')}}`;

  const newProdEnvironment = `{${[
    ...prodEnvironment
      .match(objectPattern)[0]
      .replace(/[\n\t]/g, '')
      .slice(1, -1)
      .split(','),
    ,
    newRoute,
  ]
    .filter((value) => value.length > 0)
    .join(',\n')}
  }`;

  const newRemotes = parseToObject(`{${remotes}}`);

  newRemotes[_options.projectName] = `environment.${_options.projectName}`;

  let newConfig = webpackConfig.replace(remotesPattern, `remotes: ${parseToString(newRemotes)}`);

  if (!newConfig.includes('environment')) {
    newConfig = `import { environment } from '../environments/environment';\n${newConfig}`;
  }

  tree.overwrite('webpack.config.js', format(newConfig, { parser: 'babel' }));
  // overwrite environment
  tree.overwrite(
    devEnvPath,
    format(devEnvironment.replace(objectPattern, newDevEnvironment), { parser: 'babel' })
  );
  tree.overwrite(
    prodEnvPat,
    format(prodEnvironment.replace(objectPattern, newProdEnvironment), { parser: 'babel' })
  );

  // add remote module declarations
  const moduleDeclaration = `declare module '${_options.projectName}/Module';`;

  if (tree.exists('src/decl.d.ts')) {
    let oldDeclarations = tree.get('src/decl.d.ts').content.toString();
    oldDeclarations += `\n ${moduleDeclaration}`;
    tree.overwrite('src/decl.d.ts', oldDeclarations);
  } else {
    tree.create('src/decl.d.ts', moduleDeclaration);
  }

  return tree;
}
