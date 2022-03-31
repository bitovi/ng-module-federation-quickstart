import { questionsToInitProject, questionsToRemoteModule } from './cli-questions';
import {
  IBiWorkspace,
  IQuestionInit,
  IQuestionsRemoteModule,
  log,
  getCLIParameters,
  Loader,
  exec,
} from './core';
import { ICliParams } from './core/interfaces/cli-params.interface';
import { generateNewWorkspace, generateRemote, getExistingBiConfig } from './generators';
import { build, serve } from './scripts';
import { join } from 'path';

// main function
export async function cli(args: any): Promise<void> {
  let options: ICliParams = getCLIParameters(args);

  // if serveAll
  if (options._.includes('serveAll') || options.serve) {
    const workspace: IBiWorkspace = getExistingBiConfig();
    serve(workspace.rootPath, options.serve);

    return;
  }

  if (options._.includes('buildAll') || options.build) {
    build(options.build);
  }

  // if initiating project
  if (options._.includes('init')) {
    let initProjectOptions: IQuestionInit = {
      projectName: options.projectName,
      style: options.style,
    };
    initProjectOptions = await questionsToInitProject(initProjectOptions);
    generateNewWorkspace(initProjectOptions);

    return;
  }

  // if adding new remote
  if (options.remote?.length > 0) {
    let initRemoteOptions: IQuestionInit = {
      projectName: options.remote,
      style: options.style,
    };
    initRemoteOptions = await questionsToInitProject(initRemoteOptions);

    await generateRemote(initRemoteOptions);
  }

  if (options.addRemoteModule?.length) {
    let remoteModuleOptions: IQuestionsRemoteModule = {
      projectName: options.projectName,
      remoteModule: options.addRemoteModule,
    };
    remoteModuleOptions = await questionsToRemoteModule(remoteModuleOptions);

    const workspace: IBiWorkspace = getExistingBiConfig();

    const enterApp = `cd ${join(
      workspace.rootPath,
      workspace.biConfig.apps[remoteModuleOptions.projectName].path
    )}`;
    const addRemoteModule = `ng g @bitovi/bi:sample --remoteModule=${remoteModuleOptions.remoteModule} --modify=false --remote=true`;

    try {
      await exec(`${enterApp} && ${addRemoteModule}`);
    } catch (error) {
      log.error('There was an error adding a new module');
    }
  }
}
