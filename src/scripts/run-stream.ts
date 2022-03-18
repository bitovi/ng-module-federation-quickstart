import { spawn } from 'child_process';

export async function runStreamed(command, args?: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const options: { stdio?: any; isSilent?: any; shouldThrowOnError?: any } = {};

    const commandExecution = spawn(command, { stdio: options.stdio, shell: true });
    let outputResult = '';
    let hasSomethingFailed = '';

    commandExecution?.stdout?.on('data', (data) => {
      if (!options.isSilent) {
        console.log(data.toString());
      }
      outputResult += data;
    });

    commandExecution.stderr?.on('data', (data) => {
      const outputStr = data.toString();

      if (!options.isSilent) {
        console.log(outputStr);
      }

      if (options.shouldThrowOnError) {
        hasSomethingFailed += outputStr;
      }
    });

    commandExecution.on('error', (error) => {
      console.error('Error! running command', error);
      console.error(error);
      reject(error);
    });

    commandExecution.on('close', (code) => {
      if (hasSomethingFailed.length > 0 && options.shouldThrowOnError) {
        console.error(hasSomethingFailed);
        throw Error('Failed command ' + command + ' ' + args.join(','));
      }
      resolve(outputResult);
    });
  });
}
