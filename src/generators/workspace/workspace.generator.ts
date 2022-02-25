import { execSync } from 'child_process';

import { mkdirSync } from 'fs';
import { join } from 'path';
import process from 'process';
import { ConsoleColor, IQuestionInit, log } from '../../core';
import {
  checkBiConfig,
  copyInitialAngularFiles,
  createGitignore,
  setBitoviConfigurationFile,
} from './init-process';

export async function generateNewWorkspace(initOptions: IQuestionInit): Promise<void> {
  const projectPath: string = join(process.cwd(), initOptions.projectName);

  checkBiConfig();

  // Creating workspace
  mkdirSync(join(projectPath));
  mkdirSync(join(`${projectPath}`, 'apps'));

  // generate host Angular App
  const goToWorkspace = `cd ${projectPath}/apps`;
  const createMainApp = `ng new ${initOptions.projectName} --routing --style=${initOptions.style} --skip-git --skip-install`;
  const gitInit = `cd ${projectPath} && git init`;

  execSync(`${goToWorkspace} && ${createMainApp} && ${gitInit}`);

  // copy initial angular files to project's root folder
  copyInitialAngularFiles(projectPath, initOptions.projectName);

  // use custom schematics to modify initial app to have host config
  try {
    const enterFolder = `cd ${projectPath}/apps/${initOptions.projectName}`;
    const setHostConfig = `ng g @bitovi/bi:bi --projectName=${initOptions.projectName} --host`;

    execSync(`${enterFolder} && ${setHostConfig}`);

    log.success('Host config set successfully');
  } catch (error) {
    log.error("Couldn't modify angular app to have ");
    console.error(error);
  }

  // install dependencies on root folder
  const enterRootFolder = `cd ${projectPath}`;
  const installInitialPackages = `npm install`;
  const installModuleFederation = 'npm install @angular-architects/module-federation';
  const installCustomWebpack = 'npm install @angular-builders/custom-webpack';

  try {
    execSync(
      `${enterRootFolder} && ${installInitialPackages} && ${installModuleFederation} && ${installCustomWebpack}`
    );
    log.success('Packages installed');
  } catch (error) {
    log.error('There was an error trying to install packages');
    log.color(
      ConsoleColor.FgCyan,
      `\t --> Run later: ${installInitialPackages} && ${installModuleFederation} && ${installCustomWebpack}`
    );
    console.error(error);
  }

  setBitoviConfigurationFile(initOptions.projectName, projectPath, 4200);
  await createGitignore(projectPath);
}
