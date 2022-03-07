export const newAppRoutingModule = `import { NgModule } from '@angular/core';
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
