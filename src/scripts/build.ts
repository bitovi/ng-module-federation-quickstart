import { IApp, IBitoviConfig, log } from '../core';
import { getExistingBiConfig } from '../generators';
import { join } from 'path';
import { readFileSync } from 'fs';
import { runStreamed } from './run-stream';

export function build(project?: string) {
  const rootPath = getExistingBiConfig().rootPath;
  const biConfigPath: string = join(rootPath, 'bi.json');
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
    const appProperties: IApp = biConfig.apps[appToRun];
    const commandToRun = `cd ${join(rootPath, appProperties.path)} && ng build`;

    runStreamed(commandToRun);

    log.info(`Building ${appToRun} `);
  }
}
