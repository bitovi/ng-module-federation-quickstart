import { IBitoviConfig } from '../../core/interfaces/bitovi-config.interface';
import { readFileSync } from 'fs';

export function getExistingBiConfig(): IBitoviConfig {
  const projectPath: string = process.cwd();
  let bitoviConfig: IBitoviConfig;

  try {
    bitoviConfig = JSON.parse(readFileSync(`${projectPath}/bi.json`).toString());

    return bitoviConfig;
  } catch (e) {
    console.error('You are not inside a bitovi project', e);
    process.exit(1);
  }

  return null;
}
