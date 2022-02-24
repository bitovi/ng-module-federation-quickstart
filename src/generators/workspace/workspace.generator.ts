import { IQuestionInit } from '../../cli-questions';
import { execSync, exec } from 'child_process';
import gitignore from 'gitignore';

import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import process from 'process';

import { IApp, IBitoviConfig } from './templates';

const writeGitignore = promisify(gitignore.writeFile);

export async function generateNewWorkspace(initOptions: IQuestionInit) {
  const projectPath = path.join(process.cwd(), initOptions.projectName);
  // fs.exists(path.join(projectPath, 'bi.json'));
  // import fs methods
  try {
    const bitoviConfig = fs.readFileSync(`${process.cwd()}/bi.json`).toString();
    if (bitoviConfig.length) {
      console.error('Project already exists');
      process.exit(1);
    }
  } catch (e) {
    console.log('Creating config');
  }

  fs.mkdirSync(path.join(projectPath));
  fs.mkdirSync(path.join(`${projectPath}`, 'apps'));

  const goToWorkspace = `cd ${projectPath}/apps`;
  const createMainApp = `ng new ${initOptions.projectName} --routing --style=${initOptions.style} --skip-git --skip-install`;
  const gitInit = `cd ${projectPath} && git init`;

  execSync(`${goToWorkspace} && ${createMainApp} && ${gitInit}`);

  try {
    // copy package.json to root folder
    fs.copyFileSync(
      path.join(projectPath, `apps/${initOptions.projectName}/package.json`),
      path.join(projectPath, 'package.json')
    );
  } catch (e) {
    console.error(e);
  }

  try {
    // copy .vscode directory to root folder
    const filesFromVsCode = fs.readdirSync(
      path.join(projectPath, `apps/${initOptions.projectName}/.vscode`)
    );
    fs.mkdirSync(path.join(projectPath, `.vscode`));

    for (let fileFromVsCode of filesFromVsCode) {
      fs.copyFileSync(
        path.join(projectPath, `apps/${initOptions.projectName}/.vscode/${fileFromVsCode}`),
        path.join(projectPath, `.vscode/${fileFromVsCode}`)
      );
    }
  } catch (e) {}

  try {
    // use custom schematics to tell that our new project is the host app
    execSync(
      `cd ${projectPath}/apps/${initOptions.projectName} && ng g @bitovi/bi:bi --projectName=${initOptions.projectName} --host`
    );
  } catch (e) {
    console.error(e);
  }

  try {
    // install dependencies on root folder
    execSync(
      `cd ${projectPath} && npm install && npm install @angular-architects/module-federation && npm install @angular-builders/custom-webpack`
    );
  } catch (e) {
    console.error(e);
  }

  setBitoviConfigurationFile(initOptions.projectName, projectPath, 4200);
  createGitignore(projectPath);
}

function setBitoviConfigurationFile(projectName: string, projectPath: string, port: number) {
  const newProject: IApp = {
    path: `apps/${projectName}`,
    port,
  };
  const bitoviConfig: IBitoviConfig = {
    version: '1.0.0',
    apps: { newProject },
    host: projectName,
  };

  fs.writeFileSync(path.join(projectPath, 'bi.json'), JSON.stringify(bitoviConfig));
}

async function createGitignore(targetDirectory) {
  const file = fs.createWriteStream(path.join(targetDirectory, '.gitignore'), {
    flags: 'a',
  });
  writeGitignore({
    type: 'Node',
    file: file,
  });
}
