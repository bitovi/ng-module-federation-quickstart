export const newAppRoutingModule = `
	{
		path: '',
		loadChildren: () => import('{{modulePath}}').then((m) => m.{{moduleName}}),
	}`;
