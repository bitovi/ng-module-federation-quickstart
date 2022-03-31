import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addRouteToRoutingModule, newAppRoutingModule, remoteRoute } from './module-samples';
import { capitalizeFirstLetter, getAllNameConventions, INameConventions, log } from '../../../core';
import { format } from 'prettier';
import { addExposedModule } from './module-samples/add-exposed-module.sample';

export function sample(_options: any): Rule {
  const remoteNames: INameConventions = getAllNameConventions(_options.remoteModule || 'remote');
  const remoteModule = remoteNames.kebab;

  return (tree: Tree, _context: SchematicContext) => {
    if (_options.host && _options.modify) {
      return addRemoteRouteToHost(tree, _options);
    }

    if (_options.remote && _options.modify) {
      return addRemoteModuleToApp(tree, _options.remote);
    }

    if (_options.remote && !_options.modify) {
      if (tree.exists('src/app/remote/remote.module.ts') && remoteModule === 'remote') {
        log.error("Already exists a module called 'remote'. Choose another name");

        return tree;
      }

      return chain([
        externalSchematic('@schematics/angular', 'module', { name: remoteModule, routing: true }),
        externalSchematic('@schematics/angular', 'component', {
          module: remoteModule,
          name: `${remoteModule}/${remoteModule}`,
        }),
        externalSchematic('@bitovi/bi', 'sample', {
          modify: true,
          remote: remoteModule,
          port: _options.port,
        }),
      ]);
    }
  };
}

function addRemoteModuleToApp(tree: Tree, remoteModule: string): Tree {
  const remoteNames: INameConventions = getAllNameConventions(remoteModule || 'remote');
  const appRoutingModulePath = 'src/app/app-routing.module.ts';
  const routeToAdd = newAppRoutingModule
    .replace(/\{\{modulePath\}\}/, `./${remoteNames.kebab}/${remoteNames.kebab}.module`)
    .replace(/\{\{moduleName\}\}/, capitalizeFirstLetter(`${remoteNames.pascal}Module`))
    .replace(/\{\{moduleRoute\}\}/, remoteModule === 'remote' ? '' : remoteNames.kebab);

  tree = addRouteToRoutingModule(tree, appRoutingModulePath, routeToAdd);

  const remoteModulePath = `src/app/${remoteNames.kebab}/${remoteNames.kebab}-routing.module.ts`;
  const componentPath = `{
    path: '${remoteNames.camel !== 'remote' ? remoteNames.kebab : ''}',
    component: ${capitalizeFirstLetter(`${remoteNames.pascal}Component`)}
  }`;
  const componentImport = `import {  ${capitalizeFirstLetter(
    `${remoteNames.pascal}Component`
  )} } from './${remoteNames.kebab}/${remoteNames.kebab}.component'`;

  tree = addRouteToRoutingModule(tree, remoteModulePath, componentPath);
  const routeModule = tree.get(remoteModulePath).content.toString();
  tree.overwrite(
    remoteModulePath,
    format(`${componentImport}\n${routeModule}`, { parser: 'babel' })
  );

  if (remoteModule === 'remote') {
    tree.overwrite('src/app/app.component.html', '<router-outlet></router-outlet>');
  }

  tree = addExposedModule(
    tree,
    capitalizeFirstLetter(`${remoteNames.pascal}Module`),
    `./src/app/${remoteNames.kebab}/${remoteNames.kebab}.module.ts`
  );

  return tree;
}

function addRemoteRouteToHost(tree: Tree, _options: any): Tree {
  const appRoutingModulePath = 'src/app/app-routing.module.ts';
  const remoteNames: INameConventions = getAllNameConventions(_options.remoteName);

  const newRouteToAdd = remoteRoute
    .replace(/\{\{remoteName\}\}/g, remoteNames.camel ?? 'remote')
    .replace(/\{\{remoteNameRoute\}\}/g, remoteNames.kebab ?? 'remote');

  let routerModule = tree.get('src/app/app-routing.module.ts').content.toString();

  if (!routerModule.match(/loadRemoteModule/g)) {
    routerModule = `import { loadRemoteModule } from '@angular-architects/module-federation';\n${routerModule}`;
    tree.overwrite(appRoutingModulePath, format(routerModule, { parser: 'babel' }));
  }

  if (!routerModule.match(/environment/g)) {
    routerModule = `import { environment } from '../environments/environment';\n\n${routerModule}`;
    tree.overwrite(appRoutingModulePath, format(routerModule, { parser: 'babel' }));
  }

  tree = addRouteToRoutingModule(tree, appRoutingModulePath, newRouteToAdd);

  return tree;
}
