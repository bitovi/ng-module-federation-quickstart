import arg from 'arg';
import { questionsToInitProject } from './cli-questions';
import { IQuestionInit } from './core';
import { ICliParams } from './core/interfaces/cli-params.interface';
import { generateNewWorkspace, generateRemote } from './generators';
import { serve } from './scripts';

function parseArgumentsIntoOptions(rawArgs: any): ICliParams {
  const args = arg(
    {
      '--init': Boolean,
      '--project': String,
      '--style': String,
      '--remote': String,
      '--serveAll': Boolean,
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
    serveAll: args['--serveAll'] || false,
  };
}

export async function cli(args: any): Promise<void> {
  let options: ICliParams = parseArgumentsIntoOptions(args);
  console.log('Executing custom command');

  // if serveAll
  if (options.serveAll) {
    serve(process.cwd());

    return;
  }

  // if initiating project
  if (options.init) {
    let initProjectOptions: IQuestionInit = {
      projectName: options.projectName,
      style: options.style,
    };
    initProjectOptions = await questionsToInitProject(initProjectOptions);
    generateNewWorkspace(initProjectOptions);

    return;
  }

  // ig adding new remote
  if (options.remote.length > 0) {
    let initRemoteOptions: IQuestionInit = {
      projectName: options.remote,
      style: options.style,
    };
    initRemoteOptions = await questionsToInitProject(initRemoteOptions);

    await generateRemote(initRemoteOptions);
  }
}
