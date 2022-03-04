import { ICliParams } from '../interfaces';

export function parseArgumentsIntoOptions(rawArgs: any): ICliParams {
  const reservedWords = ['init', 'style', 'remote', 'serveAll', 'serve', 'project'];
  const booleanParams = ['init', 'serveAll'];

  const splittedArguments: string[] = rawArgs.slice(2);
  const cliOptions: ICliParams = {};

  for (let index = 0; index < splittedArguments.length; index++) {
    const currentArgument = splittedArguments[index].replace(/-/g, '');
    const previousArgument = splittedArguments[index - 1]?.replace(/-/g, '');

    if (currentArgument.includes('=')) {
      const options: string[] = currentArgument.split('=');

      if (!reservedWords.includes(options[0])) {
        continue;
      }

      if (booleanParams.includes(options[0])) {
        if (options[1]) {
          cliOptions[options[0]] = options[1] === 'true';

          continue;
        }

        cliOptions[options[0]] = true;

        continue;
      }

      cliOptions[options[0]] = options[1];

      continue;
    }

    if (reservedWords.includes(previousArgument) && !currentArgument.includes('--')) {
      if (previousArgument === 'init' || previousArgument === 'serveAll') {
        cliOptions[previousArgument] = currentArgument === 'true';

        continue;
      }

      cliOptions[previousArgument] = currentArgument;
    }

    if (reservedWords.includes(currentArgument) && booleanParams.includes(currentArgument)) {
      cliOptions[currentArgument] = true;
    }
  }

  return cliOptions;
}
