import { Tree } from '@angular-devkit/schematics';
import { objectPattern, parseToObject, remotesPattern } from '../../../core';

const devEnvPath = 'src/environments/environment.ts';
const prodEnvPat = 'src/environments/environment.prod.ts';

export function addRemote(tree: Tree, _options: any): Tree {
  let webpackConfig = tree.get('webpack.config.js').content.toString();
  const remotes: string = webpackConfig
    .match(remotesPattern)[0]
    .replace(/remotes[\s\t\n]{0,}:/, '')
    .replace(/[\n\s\t\{\}]/g, '');

  const devEnvironment: string = tree.get(devEnvPath).content.toString();
  const devEnvironmentObj: { [key: string]: any } = parseToObject(
    devEnvironment.match(objectPattern)[0]
  );
  console.log(devEnvironmentObj);

  const prodEnvironment: string = tree.get(prodEnvPat).content.toString();
  const prodEnvironmentObj: { [key: string]: any } = parseToObject(
    prodEnvironment.match(objectPattern)[0]
  );

  devEnvironmentObj[
    _options.projectName
  ] = `${_options.projectName}@http://localhost:${_options.port}/remoteEntry.js`;
  prodEnvironmentObj[
    _options.projectName
  ] = `${_options.projectName}@http://localhost:${_options.port}/remoteEntry.js`;

  const newRemotes = parseToObject(remotes);

  newRemotes[_options.projectName] = `environment.${_options.projectName}`;

  let newConfig = webpackConfig.replace(
    remotesPattern,
    `remotes: ${JSON.stringify(newRemotes).replace(/,/g, ',\n')}`
  );

  if (!newConfig.includes('environment')) {
    newConfig = `import { environment } from '../environments/environment';\n${newConfig}`;
  }

  tree.overwrite('webpack.config.js', newConfig);
  // overwrite environment
  tree.overwrite(
    devEnvPath,
    devEnvironment.replace(objectPattern, JSON.stringify(devEnvironmentObj).replace(/,/g, ',\n'))
  );
  tree.overwrite(
    prodEnvPat,
    prodEnvironment.replace(objectPattern, JSON.stringify(prodEnvironmentObj).replace(/,/g, ',\n'))
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
