import { ICliParams } from '../interfaces';

const args = require('minimist')(process.argv.slice(2));

export function getCLIParameters(shortArgsConfig = { v: 'verbose', n: 'dry-run' }): ICliParams {
  let modifiedArgs = { ...args };
  const presentKeys = Object.keys(modifiedArgs);
  const overrideKeys = Object.keys(shortArgsConfig);

  for (const presentKey of presentKeys) {
    if (overrideKeys.includes(presentKey)) {
      // The short key is provided
      modifiedArgs[shortArgsConfig[presentKey]] = modifiedArgs[presentKey];
      delete modifiedArgs[presentKey];
    }
  }
  return modifiedArgs;
}
