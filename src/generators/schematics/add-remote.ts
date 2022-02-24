import { Tree } from '@angular-devkit/schematics';

const remotesRegex = /remotes[:\s{\tA-Za-z0-9\'\"\/\n.@]{1,}}/;

export function addRemote(tree: Tree, _options: any): Tree {
  const webpackConfig = tree.get('webpack.config.js').content.toString();
  const remotes = webpackConfig
    .match(remotesRegex)[0]
    .replace(/remotes[\s\t\n]{0,}:/, '')
    .replace(/[\n\s\t]/g, '');

  const newRemotes = JSON.parse(remotes) === '{}' ? {} : JSON.parse(remotes);

  newRemotes[
    _options.projectName
  ] = `${_options.projectName}@http://localhost:${_options.port}/remoteEntry.js`;

  const newConfig = webpackConfig.replace(remotesRegex, `remotes: ${JSON.stringify(newRemotes)}`);

  tree.overwrite('webpack.config.js', newConfig);

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
