import { mkdirSync } from 'fs';
import { join } from 'path';
import process from 'process';
import {
  ConsoleColor,
  exec,
  getAllNameConventions,
  INameConventions,
  IQuestionInit,
  Loader,
  log,
} from '../../core';
import {
  checkBiConfig,
  copyInitialAngularFiles,
  createGitignore,
  setBitoviConfigurationFile,
} from './init-process';

export async function generateNewWorkspace(initOptions: IQuestionInit): Promise<void> {
  const loader: Loader = new Loader();
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

  loader.startTimer('Creating Workspace');
  await exec(`${goToWorkspace} && ${createMainApp} && ${gitInit}`);
  loader.clearTimer();

  // copy initial angular files to project's root folder
  copyInitialAngularFiles(projectPath, projectNames.kebab);

  // use custom schematics to modify initial app to have host config
  try {
    loader.startTimer('Setting Host');
    const enterFolder = `cd ${projectPath}/apps/${projectNames.kebab}`;
    const setHostConfig = `ng g @bitovi/bi:bi --projectName=${projectNames.kebab} --host`;

    await exec(`${enterFolder} && ${setHostConfig}`);

    loader.clearTimer();
    log.success('Host config set successfully');
  } catch (error) {
    loader.clearTimer();
    log.error("Couldn't modify angular app to have host config");
    console.error(error);
  }

  // install dependencies on root folder
  const enterRootFolder = `cd ${projectPath}`;
  const installInitialPackages = `npm install`;
  const installModuleFederation = 'npm install @angular-architects/module-federation';
  const installCustomWebpack = 'npm install @angular-builders/custom-webpack';

  loader.startTimer('Installing dependencies');
  try {
    await exec(
      `${enterRootFolder} && ${installInitialPackages} && ${installModuleFederation} && ${installCustomWebpack}`
    );

    loader.clearTimer();
    log.success('Dependencies installed');
  } catch (error) {
    loader.clearTimer();
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
