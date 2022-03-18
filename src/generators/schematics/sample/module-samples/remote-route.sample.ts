export const remoteRoute = `
	{
		path: '{{remoteName}}',
		loadChildren: () =>
			loadRemoteModule({
				type: 'module',
				remoteEntry: environment.remote.{{remoteName}},
				exposedModule: 'RemoteModule',
			}).then((m) => m.RemoteModule),
	}`;
