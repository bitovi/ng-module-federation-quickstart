import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { IBiWorkspace, IQuestionInit, log } from '../../core';
import { IApp, IBitoviConfig } from '../../core/interfaces/bitovi-config.interface';
import { getExistingBiConfig } from '../workspace';

export async function generateRemote(appOptions: IQuestionInit): Promise<void> {
  const workspace = getExistingBiConfig();
  const projectPath: string = workspace.rootPath;
  let bitoviConfig: IBitoviConfig = workspace.biConfig;

  // create remote app
  const enterPath = `cd ${projectPath}/apps`;
  const generateRemote = `ng new ${appOptions.projectName} --routing --style=${appOptions.style} --skip-git --skip-install`;

  try {
    execSync(`${enterPath} && ${generateRemote}`);
    log.success('Generated remote app');
  } catch (error) {
    log.error('There was an error generating yor remote app');
    console.error(error);
    process.exit(1);
  }

  // modify remote to have custom webpack configuration
  const remotePort: number = getNextPort(bitoviConfig);
  const enterRemote = `cd ${projectPath}/apps/${appOptions.projectName}`;
  const modifyRemote = ` ng g @bitovi/bi:bi --port=${remotePort} --projectName=${appOptions.projectName} --remote=true`;

  try {
    execSync(`${enterRemote} && ${modifyRemote}`);
    log.success('Remote set successfully');
  } catch (error) {
    log.error('There was an error trying to set webpack on remote app');
  }

  execSync(
    `cd ${projectPath}/apps/${appOptions.projectName} && ng g @bitovi/bi:sample --remote=true --port=${remotePort} --modify=false`
  );
  const newProject: IApp = {
    path: `apps/${appOptions.projectName}`,
    port: remotePort,
  };
  bitoviConfig.apps[appOptions.projectName] = newProject;

  // add remote to host app
  const enterHost = `cd ${projectPath}/apps/${bitoviConfig.host}`;
  const addRemoteSchematic = `ng g @bitovi/bi:bi --projectName=${appOptions.projectName} --port=${remotePort} --addRemote=true --sample=true`;
  const addRemoteSample = `ng g @bitovi/bi:sample --host=true --modify=true --port=${remotePort} --remoteName=${appOptions.projectName}`;

  try {
    execSync(`${enterHost} && ${addRemoteSchematic} && ${addRemoteSample}`);
  } catch (e) {
    console.error(e);
  }

  // modify project configuration
  writeFileSync(join(projectPath, 'bi.json'), JSON.stringify(bitoviConfig));
}

function getNextPort(bitoviConfig: IBitoviConfig): number {
  const ports: number[] = Object.keys(bitoviConfig.apps).map(
    (app) => bitoviConfig.apps[app].port as number
  );
  const nextPort = Math.max(...ports) + 1;

  return nextPort;
}
