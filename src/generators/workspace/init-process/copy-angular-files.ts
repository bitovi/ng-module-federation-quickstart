import { copyFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ConsoleColor, log } from '../../../core';

export function copyInitialAngularFiles(projectPath: string, projectName: string): void {
  // copy package.json to root folder
  try {
    copyFileSync(
      join(projectPath, `apps/${projectName}/package.json`),
      join(projectPath, 'package.json')
    );

    log.success('package.json copied successfully');
  } catch (error) {
    log.error("Couldn't copy package.json to root folder");
    console.error(error);
  }

  // copy .vscode directory to root folder
  try {
    const filesFromVsCode: string[] = readdirSync(join(projectPath, `apps/${projectName}/.vscode`));
    mkdirSync(join(projectPath, `.vscode`));

    for (let fileFromVsCode of filesFromVsCode) {
      copyFileSync(
        join(projectPath, `apps/${projectName}/.vscode/${fileFromVsCode}`),
        join(projectPath, `.vscode/${fileFromVsCode}`)
      );
    }

    log.success('.vscode copied successfully');
  } catch (error) {
    log.error("Couldn't copy .vscode to root folder");
    console.error(error);
  }
}
