import { IBitoviConfig, IBiWorkspace, log } from '../../core';
import { existsSync, readFileSync } from 'fs';
import { normalize, join } from 'path';

export function getExistingBiConfig(): IBiWorkspace {
  let rootPath: string = process.cwd();
  let biConfigPath = normalize(join(rootPath, 'bi.json'));

  if (!existsSync(biConfigPath)) {
    rootPath = searchBiWorkspaceRoot();
    biConfigPath = normalize(join(rootPath, 'bi.json'));
  }

  try {
    const bitoviConfig: IBitoviConfig = JSON.parse(readFileSync(biConfigPath).toString());

    const workspaceConfig: IBiWorkspace = {
      biConfig: bitoviConfig,
      rootPath: rootPath,
    };

    return workspaceConfig;
  } catch (error) {
    log.error('There was an error trying to read workspace configuration');
    console.error(error);
    process.exit(1);
  }
}

function searchBiWorkspaceRoot(): string {
  const routeSeparator = process.cwd().includes('/') ? '/' : '\\';
  const commandPath = normalize(process.cwd()).split(routeSeparator);

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
