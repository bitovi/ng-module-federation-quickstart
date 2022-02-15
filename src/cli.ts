import arg from 'arg';
import { questionsToInitProject } from './cli-questions';
import { generateNewWorkspace } from './generators';

function parseArgumentsIntoOptions(rawArgs: any) {
	const args = arg(
		{
			'--init': Boolean,
			'--project': String,
			'--style': String,
		},
		{
			argv: rawArgs.slice(2),
		},
	);
	return {
		init: args['--init'] || false,
		projectName: args['--project'] || '',
		style: args['--project'] || '',
	};
}

export async function cli(args: any) {
	let options = parseArgumentsIntoOptions(args);

	if (options.init) {
		const initOptions = await questionsToInitProject(options);
		generateNewWorkspace(initOptions);

		return;
	}
}
