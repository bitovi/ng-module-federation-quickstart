export const remoteRoute = `
	{
		path: '{{remoteNameRoute}}',
		loadChildren: () =>
			loadRemoteModule({
				type: 'module',
				remoteEntry: environment.remotes.{{remoteName}},
				exposedModule: 'RemoteModule',
			}).then((m) => m.RemoteModule),
	}`;
