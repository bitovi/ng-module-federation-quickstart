import { IBitoviConfig, IBiWorkspace, log } from '../../core';
import { existsSync, readFileSync } from 'fs';
import { normalize, join } from 'path';

export function getExistingBiConfig(): IBiWorkspace {
  let commandPath: string = process.cwd();
  const biConfigPath = normalize(join(commandPath, 'bi.json'));
  console.log(biConfigPath);
  if (!existsSync(biConfigPath)) {
    commandPath = searchBiWorkspaceRoot();
  }

  try {
    const bitoviConfig: IBitoviConfig = JSON.parse(readFileSync(biConfigPath).toString());

    const workspaceConfig: IBiWorkspace = {
      biConfig: bitoviConfig,
      rootPath: commandPath,
    };

    return workspaceConfig;
  } catch (error) {
    log.error('There was an error trying to read workspace configuration');
    console.error(error);
    process.exit(1);
  }
}

function searchBiWorkspaceRoot(): string {
  const commandPath = normalize(process.cwd()).split(process.cwd().includes('/') ? '/' : '\\');
  console.log(commandPath);
  for (let index = commandPath.length - 1; index >= 0; index--) {
    commandPath.pop();
    const upperPath: string = commandPath.join('/');

    if (existsSync(`${upperPath}/bi.json`)) {
      return upperPath;
    }
  }

  log.error('You are not in a bitovi project');
  process.exit(1);
}
