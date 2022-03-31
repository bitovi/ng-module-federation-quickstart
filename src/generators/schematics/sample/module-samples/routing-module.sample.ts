export const newAppRoutingModule = `
	{
		path: '{{moduleRoute}}',
		loadChildren: () => import('{{modulePath}}').then((m) => m.{{moduleName}}),
	}`;
