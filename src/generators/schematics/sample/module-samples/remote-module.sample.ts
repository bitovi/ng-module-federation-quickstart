export const newRemoteModule = `import { NgModule } from '@angular/core';
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
