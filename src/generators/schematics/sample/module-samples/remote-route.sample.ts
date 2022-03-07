export const remoteRoute = `
	{
		path: '{{remoteName}}',
		loadChildren: () =>
			loadRemoteModule({
				type: 'module',
				remoteEntry: environment.{{remoteName}},
				exposedModule: 'RemoteModule',
			}).then((m) => m.RemoteModule),
	}`;
