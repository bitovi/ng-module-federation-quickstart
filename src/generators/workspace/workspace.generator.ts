import { IQuestionInit } from '../../cli-questions';
import { execSync, exec } from 'child_process';
import gitignore from 'gitignore';

import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

import { bitoviConfigTemplate } from './templates';

const writeGitignore = promisify(gitignore.writeFile);
export const writeFile = promisify(fs.writeFile);

export async function generateNewWorkspace(initOptions: IQuestionInit) {
	const projectPath = `${execSync('pwd').toString().replace(/\n/g, '')}/${
		initOptions.projectName
	}`;
	const createWorkspace = `mkdir ${initOptions.projectName} && cd ${initOptions.projectName} && mkdir apps && cd apps`;
	const createMainApp = `ng new ${initOptions.projectName} --routing --style=${initOptions.style} --skip-git --skip-install`;
	const movePackage = `mv ./${initOptions.projectName}/package.json ..`;
	const moveVsCode = `mv ./${initOptions.projectName}/.vscode ..`;
	const gitInit = 'cd .. && git init';
	const install = 'npm install';

	execSync(
		`${createWorkspace} && ${createMainApp} && ${movePackage} && ${moveVsCode} && ${gitInit} && ${install}`,
	);

	setBitoviConfigurationFile(initOptions.projectName, projectPath);
	createGitignore(projectPath);
}

function setBitoviConfigurationFile(projectName: string, projectPath: string) {
	execSync(`touch ./${projectName}/bi.json`);

	const bitoviConfig = JSON.parse(bitoviConfigTemplate);
	bitoviConfig.apps[projectName] = `apps/${projectName}`;

	writeFile(
		path.join(projectPath, 'bi.json'),
		JSON.stringify(bitoviConfig),
		'utf8',
	);
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
