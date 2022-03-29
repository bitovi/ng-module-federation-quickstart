import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  ConsoleColor,
  exec,
  getAllNameConventions,
  INameConventions,
  IQuestionInit,
  Loader,
  log,
} from '../../core';
import { IApp, IBitoviConfig } from '../../core/interfaces/bitovi-config.interface';
import { getExistingBiConfig } from '../workspace';
import { format } from 'prettier';

export async function generateRemote(appOptions: IQuestionInit): Promise<void> {
  const loader: Loader = new Loader();
  const workspace = getExistingBiConfig();
  const projectNames: INameConventions = getAllNameConventions(appOptions.projectName);
  const projectPath: string = workspace.rootPath;
  let bitoviConfig: IBitoviConfig = workspace.biConfig;

  // create remote app
  const enterPath = `cd ${projectPath}/apps`;
  const generateRemote = `ng new ${projectNames.kebab} --routing --style=${appOptions.style} --skip-git --skip-install`;

  loader.startTimer('Creating remote app');
  try {
    await exec(`${enterPath} && ${generateRemote}`);
    loader.clearTimer();
    log.success('Generated remote app');
  } catch (error) {
    loader.clearTimer();
    log.error('There was an error generating yor remote app');
    console.error(error);
    process.exit(1);
  }

  // modify remote to have custom webpack configuration
  const remotePort: number = getNextPort(bitoviConfig);
  const enterRemote = `cd ${projectPath}/apps/${projectNames.kebab}`;
  const modifyRemote = `ng g @bitovi/bi:bi --port=${remotePort} --projectName=${projectNames.kebab} --remote=true`;

  loader.startTimer('Setting remote app');
  try {
    await exec(`${enterRemote} && ${modifyRemote}`);
    log.success('Remote set successfully');
  } catch (error) {
    loader.clearTimer();
    log.error('There was an error trying to set webpack on remote app');
  }

  await exec(
    `cd ${projectPath}/apps/${projectNames.kebab} && ng g @bitovi/bi:sample --remote=true --port=${remotePort} --modify=false`
  );
  const newProject: IApp = {
    path: `apps/${projectNames.kebab}`,
    port: remotePort,
  };
  bitoviConfig.apps[projectNames.camel] = newProject;

  // add remote to host app
  const enterHost = `cd ${projectPath}/apps/${bitoviConfig.host}`;
  const addRemoteSchematic = `ng g @bitovi/bi:bi --projectName=${projectNames.kebab} --port=${remotePort} --addRemote=true --sample=true`;
  const addRemoteSample = `ng g @bitovi/bi:sample --host=true --modify=true --port=${remotePort} --remoteName=${projectNames.kebab}`;

  try {
    await exec(`${enterHost} && ${addRemoteSchematic} && ${addRemoteSample}`);
  } catch (e) {
    console.error(e);
  }

  log.color(ConsoleColor.FgRed, 'REMEMBER!');
  log.color(ConsoleColor.FgCyan, '\t -> Change link in production environment');

  // modify project configuration
  writeFileSync(
    join(projectPath, 'bi.json'),
    format(JSON.stringify(bitoviConfig), { parser: 'json' })
  );
}

function getNextPort(bitoviConfig: IBitoviConfig): number {
  const ports: number[] = Object.keys(bitoviConfig.apps).map(
    (app) => bitoviConfig.apps[app].port as number
  );
  const nextPort = Math.max(...ports) + 1;

  return nextPort;
}
