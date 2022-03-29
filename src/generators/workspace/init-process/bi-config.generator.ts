import { join } from 'path';
import { writeFileSync } from 'fs';
import { log, Loader } from '../../../core';
import { IApp, IBitoviConfig } from '../../../core/interfaces/bitovi-config.interface';
import { format } from 'prettier';

export function setBitoviConfigurationFile(projectName: string, projectPath: string, port: number) {
  const loader: Loader = new Loader();

  const newProject: IApp = {
    path: `apps/${projectName}`,
    port,
  };
  const bitoviConfig: IBitoviConfig = {
    version: '1.0.0',
    apps: { [projectName]: newProject },
    host: projectName,
  };

  loader.startTimer('Creating bitovi config');
  try {
    writeFileSync(
      join(projectPath, 'bi.json'),
      format(JSON.stringify(bitoviConfig), { parser: 'json' })
    );
    log.success('Bi config added to root folder');
    loader.clearTimer();
  } catch (error) {
    log.error("Couldn't generate bi config");
    loader.clearTimer();
    console.error(error);
  }
}
