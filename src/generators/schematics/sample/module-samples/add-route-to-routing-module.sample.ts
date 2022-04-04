import { Tree } from '@angular-devkit/schematics';
import { objectPattern, routesPattern } from '../../../../core';
import { format } from 'prettier';

export function addRouteToRoutingModule(
  tree: Tree,
  routingModulePath: string,
  routeToAdd: string
): Tree {
  const oldRouterModule: string = tree.get(routingModulePath).content.toString();
  const allRoutes = oldRouterModule.match(routesPattern)[0];
  const foundRoutes = allRoutes.match(objectPattern);

  let finalRoutes = '';
  let newRouterModule = '';

  if (foundRoutes) {
    finalRoutes = foundRoutes[0].trim();
    finalRoutes += `${finalRoutes[finalRoutes.length - 1] === ',' ? '' : ','} ${routeToAdd}`;
    finalRoutes = `const routes: Routes = [${finalRoutes}]`;
  } else {
    finalRoutes = `const routes: Routes = [${routeToAdd}]`;
  }

  newRouterModule = oldRouterModule.replace(routesPattern, finalRoutes);
  tree.overwrite(routingModulePath, format(newRouterModule, { parser: 'babel' }));

  return tree;
}
