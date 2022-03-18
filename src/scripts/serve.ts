import { readFileSync } from 'fs';
import { join } from 'path';
import { log } from '../core';
import { IApp, IBitoviConfig } from '../core/interfaces/bitovi-config.interface';
import { runStreamed } from './run-stream';

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

    log.info(`Running ${appToRun} at http://localhost:${appProperties.port}`);
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
