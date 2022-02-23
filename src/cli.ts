import arg from 'arg';
import { questionsToInitProject } from './cli-questions';
import { generateNewWorkspace, generateRemote } from './generators';

function parseArgumentsIntoOptions(rawArgs: any) {
  const args = arg(
    {
      '--init': Boolean,
      '--project': String,
      '--style': String,
      '--remote': String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    init: args['--init'] || false,
    projectName: args['--project'] || '',
    style: args['--project'] || '',
    remote: args['--remote'] || '',
  };
}

export async function cli(args: any) {
  let options = parseArgumentsIntoOptions(args);
  console.log('Executing custom command');

  // if initiating project
  if (options.init) {
    const initOptions = await questionsToInitProject(options);
    generateNewWorkspace(initOptions);

    return;
  }

  // ig adding new remote
  if (options.remote.length > 0) {
    const appOptions = await questionsToInitProject({
      ...options,
      projectName: options.remote,
    });

    await generateRemote(appOptions);
  }
}
