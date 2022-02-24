import { chain, externalSchematic, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const newRemoteModule = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteComponent } from './remote/remote.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: RemoteComponent,
	},
];

@NgModule({
	declarations: [RemoteComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class RemoteModule {}`;

const newAppRoutingModule = `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./remote/remote.module').then((m) => m.RemoteModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}`;

const newAppModule = `
import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'remote',
		loadChildren: () =>
			loadRemoteModule({
				type: 'module',
				remoteEntry: 'http://localhost:{{port}}/remoteEntry.js',
				exposedModule: 'RemoteModule',
			}).then((m) => m.RemoteModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
`;

export function sample(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.host && _options.modify) {
      tree.overwrite(
        'src/app/app-routing.module.ts',
        newAppModule.replace(/\{\{port\}\}/, _options.port)
      );

      return tree;
    }

    if (_options.remote && _options.modify) {
      tree.overwrite('src/app/remote/remote.module.ts', newRemoteModule);
      tree.overwrite('src/app/app-routing.module.ts', newAppRoutingModule);
      tree.overwrite('src/app/app.component.html', '<router-outlet></router-outlet>');

      let exposesContent = tree.get('webpack.config.js').content.toString();
      const newExposes = `exposes: {RemoteModule: './src/app/remote/remote.module.ts'}`;

      exposesContent = exposesContent.replace(
        /exposes[:\{A-Za-z0-9\'\"\.\,\s\t\n]{0,}\}/,
        newExposes
      );
      tree.overwrite('webpack.config.js', exposesContent);

      return tree;
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
