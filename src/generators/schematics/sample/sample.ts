import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { newAppRoutingModule, newRemoteModule, remoteRoute } from './module-samples';

const routesRegex = /const routes[\{\}A-Za-z\'\",\(\)\:\@\.\=\>\-\_\/\n\s\t\[0-9]{1,}\]/;
const singleRouteRegex = /\{[\{\}A-Za-z\'\",\(\)\:\@\.\=\>\-\_\/\n\s\t\[0-9]{1,}\}/;

export function sample(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.host && _options.modify) {
      return addRemoteRouteToHost(tree, _options);
    }

    if (_options.remote && _options.modify) {
      return addRemoteModuleToNewApp(tree);
    }

    if (_options.remote && !_options.modify) {
      return chain([
        externalSchematic('@schematics/angular', 'module', { name: 'remote' }),
        externalSchematic('@schematics/angular', 'component', {
          module: 'remote',
          name: 'remote/remote',
        }),
        externalSchematic('@bitovi/bi', 'sample', {
          modify: true,
          remote: true,
          port: _options.port,
        }),
      ]);
    }
  };
}

function addRemoteModuleToNewApp(tree: Tree): Tree {
  tree.overwrite('src/app/remote/remote.module.ts', newRemoteModule);
  tree.overwrite('src/app/app-routing.module.ts', newAppRoutingModule);
  tree.overwrite('src/app/app.component.html', '<router-outlet></router-outlet>');

  let exposesContent = tree.get('webpack.config.js').content.toString();
  const newExposes = `exposes: {RemoteModule: './src/app/remote/remote.module.ts'}`;

  exposesContent = exposesContent.replace(/exposes[:\{A-Za-z0-9\'\"\.\,\s\t\n]{0,}\}/, newExposes);
  tree.overwrite('webpack.config.js', exposesContent);

  return tree;
}

function addRemoteRouteToHost(tree: Tree, _options: any): Tree {
  const oldRouterModule: string = tree.get('src/app/app-routing.module.ts').content.toString();
  const allRoutes = oldRouterModule.match(routesRegex)[0];
  const foundRoutes = allRoutes.match(singleRouteRegex);
  const newRouteToAdd = remoteRoute
    .replace(/\{\{port\}\}/, _options.port)
    .replace(/\{\{remoteName\}\}/, _options.remoteName ?? 'remote');

  let finalRoutes = '';
  let newRouterModule = '';

  if (foundRoutes) {
    finalRoutes = foundRoutes[0].trim();
    finalRoutes += `${finalRoutes[finalRoutes.length - 1] === ',' ? '' : ','} ${newRouteToAdd}`;
    finalRoutes = `const routes: Routes = [${finalRoutes}]`;
  } else {
    finalRoutes = `const routes: Routes = [${newRouteToAdd}]`;
  }

  newRouterModule = oldRouterModule.replace(routesRegex, finalRoutes);

  if (!oldRouterModule.match(/loadRemoteModule/g)) {
    newRouterModule = `import { loadRemoteModule } from '@angular-architects/module-federation';\n${newRouterModule}`;
  }

  tree.overwrite('src/app/app-routing.module.ts', newRouterModule);

  return tree;
}
