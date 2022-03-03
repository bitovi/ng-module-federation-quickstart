import { IBitoviConfig, IBiWorkspace, log } from '../../core';
import { existsSync, readFileSync } from 'fs';
import { normalize } from 'path';

export function getExistingBiConfig(): IBiWorkspace {
  let commandPath: string = process.cwd();

  if (!existsSync(`${commandPath}/bi.json`)) {
    commandPath = searchBiWorkspaceRoot();
  }

  try {
    const bitoviConfig: IBitoviConfig = JSON.parse(
      readFileSync(`${commandPath}/bi.json`).toString()
    );

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
  const commandPath = normalize(process.cwd()).split('/');

  for (const folder of commandPath) {
    commandPath.pop();
    const upperPath: string = commandPath.join('/');

    if (existsSync(`${upperPath}/bi.json`)) {
      return upperPath;
    }
  }

  log.error('You are not in a bitovi project');
  process.exit(1);
}
