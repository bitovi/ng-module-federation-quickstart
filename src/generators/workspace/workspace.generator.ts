import { IQuestionInit } from '../../cli-questions';
import { execSync, exec } from 'child_process';
import gitignore from 'gitignore';

import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import process from 'process';

import { bitoviConfigTemplate } from './templates';

const writeGitignore = promisify(gitignore.writeFile);

export async function generateNewWorkspace(initOptions: IQuestionInit) {
	const projectPath = path.join(process.cwd(), initOptions.projectName);

	fs.mkdirSync(path.join(projectPath));
	fs.mkdirSync(path.join(`${projectPath}`, 'apps'));

	const goToWorkspace = `cd ${projectPath}/apps`;
	const createMainApp = `ng new ${initOptions.projectName} --routing --style=${initOptions.style} --skip-git --skip-install`;
	const gitInit = `cd ${projectPath} && git init`;

	execSync(`${goToWorkspace} && ${createMainApp} && ${gitInit}`);

	try {
		fs.copyFileSync(
			path.join(projectPath, `apps/${initOptions.projectName}/package.json`),
			path.join(projectPath, 'package.json'),
		);
	} catch (e) {
		console.error(e);
	}

	try {
		const filesFromVsCode = fs.readdirSync(
			path.join(projectPath, `apps/${initOptions.projectName}/.vscode`),
		);
		fs.mkdirSync(path.join(projectPath, `.vscode`));

		for (let fileFromVsCode of filesFromVsCode) {
			fs.copyFileSync(
				path.join(
					projectPath,
					`apps/${initOptions.projectName}/.vscode/${fileFromVsCode}`,
				),
				path.join(projectPath, `.vscode/${fileFromVsCode}`),
			);
		}
	} catch (e) {
		console.error(e);
	}

	try {
		execSync(
			`cd ${projectPath}/apps/${initOptions.projectName} && ng g @bitovi/bi:bi --projectName=${initOptions.projectName} --host`,
		);
	} catch (e) {
		console.error(e);
	}

	try {
		execSync(`cd ${projectPath} && npm install`);
	} catch (e) {
		console.error(e);
	}

	setBitoviConfigurationFile(initOptions.projectName, projectPath);
	createGitignore(projectPath);
}

function setBitoviConfigurationFile(projectName: string, projectPath: string) {
	const bitoviConfig = JSON.parse(bitoviConfigTemplate);
	bitoviConfig.apps[projectName] = `apps/${projectName}`;
	bitoviConfig.host = projectName;

	fs.writeFileSync(
		path.join(projectPath, 'bi.json'),
		JSON.stringify(bitoviConfig),
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
