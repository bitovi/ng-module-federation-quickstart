import { join } from 'path';
import { writeFileSync } from 'fs';
import { log } from '../../../core';
import { IApp, IBitoviConfig } from '../../../core/interfaces/bitovi-config.interface';

export function setBitoviConfigurationFile(projectName: string, projectPath: string, port: number) {
  const newProject: IApp = {
    path: `apps/${projectName}`,
    port,
  };
  const bitoviConfig: IBitoviConfig = {
    version: '1.0.0',
    apps: { newProject },
    host: projectName,
  };

  try {
    writeFileSync(join(projectPath, 'bi.json'), JSON.stringify(bitoviConfig));
    log.success('Bi config added to root folder');
  } catch (error) {
    log.error("Couldn't generate bi config");
    console.error(error);
  }
}
