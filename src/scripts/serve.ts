import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { log } from '../core';
import { IBitoviConfig } from '../core/interfaces/bitovi-config.interface';

export function serve(workspacePath: string) {
  const biConfigPath: string = join(workspacePath, 'bi.json');
  const biConfig: IBitoviConfig = JSON.parse(readFileSync(biConfigPath, 'utf-8'));

  const allApps = Object.keys(biConfig.apps);

  for (const appToRun of allApps) {
    const appProperties = biConfig.apps[appToRun];
    const isHost = biConfig.host === appToRun;

    const appPath = join(workspacePath, appProperties.path);

    let commandToRun = `cd ${appPath} && ng serve --port=${appProperties.port}`;

    if (!isHost) {
      commandToRun += ' --liveReload=false';
    }

    log.info(`Running ${appToRun} at http://locahost:${appProperties.port}`);

    runStreamed(commandToRun);
  }
}

async function runStreamed(command, args?: any[]) {
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
