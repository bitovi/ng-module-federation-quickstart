export const remoteRoute = `
	{
		path: '{{remoteName}}',
		loadChildren: () =>
			loadRemoteModule({
				type: 'module',
				remoteEntry: 'http://localhost:{{port}}/remoteEntry.js',
				exposedModule: 'RemoteModule',
			}).then((m) => m.RemoteModule),
	}`;
