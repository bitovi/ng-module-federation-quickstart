import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { log } from '../core';
import { IApp, IBitoviConfig } from '../core/interfaces/bitovi-config.interface';

export function serve(workspacePath: string, project?: string) {
  const biConfigPath: string = join(workspacePath, 'bi.json');
  const biConfig: IBitoviConfig = JSON.parse(readFileSync(biConfigPath, 'utf-8'));

  let allApps = Object.keys(biConfig.apps);

  if (project) {
    if (!allApps.includes(project)) {
      log.error('The project specified does not exist');
      process.exit(1);
    }

    allApps = [project];
  }

  for (const appToRun of allApps) {
    const isHost = biConfig.host === appToRun;
    const appProperties: IApp = biConfig.apps[appToRun];
    serveApp(workspacePath, appProperties, isHost);

    log.info(`Running ${appToRun} at http://locahost:${appProperties.port}`);
  }
}

function serveApp(workspacePath: string, appProperties: IApp, isHost = false): Promise<any> {
  const appPath = join(workspacePath, appProperties.path);
  let commandToRun = `cd ${appPath} && ng serve --port=${appProperties.port}`;

  if (!isHost) {
    commandToRun += ' --liveReload=false';
  }

  return runStreamed(commandToRun);
}

async function runStreamed(command, args?: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const options: { stdio?: any; isSilent?: any; shouldThrowOnError?: any } = {};

    const commandExecution = spawn(command, { stdio: options.stdio, shell: true });
    let outputResult = '';
    let hasSomethingFailed = '';

    commandExecution?.stdout?.on('data', (data) => {
      if (!options.isSilent) {
        console.log(data.toString());
      }
      outputResult += data;
    });

    commandExecution.stderr?.on('data', (data) => {
      const outputStr = data.toString();

      if (!options.isSilent) {
        console.log(outputStr);
      }

      if (options.shouldThrowOnError) {
        hasSomethingFailed += outputStr;
      }
    });

    commandExecution.on('error', (error) => {
      console.error('Error! running command', error);
      console.error(error);
      reject(error);
    });

    commandExecution.on('close', (code) => {
      if (hasSomethingFailed.length > 0 && options.shouldThrowOnError) {
        console.error(hasSomethingFailed);
        throw Error('Failed command ' + command + ' ' + args.join(','));
      }
      resolve(outputResult);
    });
  });
}
