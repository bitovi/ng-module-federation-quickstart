import { execSync } from 'child_process';

import { mkdirSync } from 'fs';
import { join } from 'path';
import process from 'process';
import {
  ConsoleColor,
  getAllNameConventions,
  INameConventions,
  IQuestionInit,
  log,
} from '../../core';
import {
  checkBiConfig,
  copyInitialAngularFiles,
  createGitignore,
  setBitoviConfigurationFile,
} from './init-process';

export async function generateNewWorkspace(initOptions: IQuestionInit): Promise<void> {
  const projectNames: INameConventions = getAllNameConventions(initOptions.projectName);
  const projectPath: string = join(process.cwd(), projectNames.kebab);

  // check if already exists a bitovi project in the folder
  checkBiConfig();

  // Creating workspace
  mkdirSync(join(projectPath));
  mkdirSync(join(`${projectPath}`, 'apps'));

  // generate host Angular App
  const goToWorkspace = `cd ${projectPath}/apps`;
  const createMainApp = `ng new ${projectNames.kebab} --routing --style=${initOptions.style} --skip-git --skip-install`;
  const gitInit = `cd ${projectPath} && git init`;

  execSync(`${goToWorkspace} && ${createMainApp} && ${gitInit}`);

  // copy initial angular files to project's root folder
  copyInitialAngularFiles(projectPath, projectNames.kebab);

  // use custom schematics to modify initial app to have host config
  try {
    const enterFolder = `cd ${projectPath}/apps/${projectNames.kebab}`;
    const setHostConfig = `ng g @bitovi/bi:bi --projectName=${projectNames.kebab} --host`;

    execSync(`${enterFolder} && ${setHostConfig}`);

    log.success('Host config set successfully');
  } catch (error) {
    log.error("Couldn't modify angular app to have host config");
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
  // set initial configuration
  setBitoviConfigurationFile(projectNames.kebab, projectPath, 4200);
  await createGitignore(projectPath);
}
