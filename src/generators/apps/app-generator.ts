import { execSync } from 'child_process';
import fs from 'fs';
import { IQuestionInit } from '../../cli-questions';
import path from 'path';

export async function generateRemote(appOptions: IQuestionInit): Promise<void> {
  const projectPath = path.join(process.cwd());
  let bitoviConfig = null;

  try {
    bitoviConfig = JSON.parse(fs.readFileSync(`${projectPath}/bi.json`).toString());
  } catch (e) {
    console.error('You are not inside a bitovi project', e);
    process.exit(1);
  }

  const createMainApp = `cd ${projectPath}/apps && ng new ${appOptions.projectName} --routing --style=${appOptions.style} --skip-git --skip-install && cd ..`;

  const ports: number[] = Object.keys(bitoviConfig.apps).map(
    (app) => bitoviConfig.apps[app].port as number
  );
  const remotePort = Math.max(...ports) + 1;

  // run schematics to add remote
  execSync(
    `${createMainApp} && cd ${projectPath}/apps/${appOptions.projectName} && ng g @bitovi/bi:bi  --port=${remotePort} --projectName=${appOptions.projectName} --remote`
  );
  bitoviConfig.apps[appOptions.projectName] = {};
  bitoviConfig.apps[appOptions.projectName].path = `apps/${appOptions.projectName}`;
  bitoviConfig.apps[appOptions.projectName].port = remotePort;

  // add remote to host app
  const enterHost = `cd ${projectPath}/apps/${bitoviConfig.host}`;
  const addRemoteSchematic = `ng g @bitovi/bi:bi --projectName=${appOptions.projectName} --port=${remotePort} --addRemote`;

  try {
    execSync(`${enterHost} && ${addRemoteSchematic}`);
  } catch (e) {
    console.error(e);
  }

  // modify project configuration
  fs.writeFileSync(path.join(projectPath, 'bi.json'), JSON.stringify(bitoviConfig));
}
