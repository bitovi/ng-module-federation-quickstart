import { questionsToInitProject } from './cli-questions';
import { IBiWorkspace, IQuestionInit, log, parseArgumentsIntoOptions } from './core';
import { ICliParams } from './core/interfaces/cli-params.interface';
import { generateNewWorkspace, generateRemote, getExistingBiConfig } from './generators';
import { serve } from './scripts';

export async function cli(args: any): Promise<void> {
  let options: ICliParams = parseArgumentsIntoOptions(args);
  log.info('Executing custom command');

  // if serveAll
  if (options.serveAll) {
    const workspace: IBiWorkspace = getExistingBiConfig();
    serve(workspace.rootPath);

    return;
  }

  // if serving one project
  if (options.serve) {
    const workspace: IBiWorkspace = getExistingBiConfig();
    serve(workspace.rootPath, options.serve);

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

  // if adding new remote
  if (options.remote.length > 0) {
    let initRemoteOptions: IQuestionInit = {
      projectName: options.remote,
      style: options.style,
    };
    initRemoteOptions = await questionsToInitProject(initRemoteOptions);

    await generateRemote(initRemoteOptions);
  }
}
