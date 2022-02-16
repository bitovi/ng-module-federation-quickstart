import { execSync, exec } from 'child_process';
import fs from 'fs';
import { IQuestionInit } from '../../cli-questions';
import { writeFile } from '../workspace';
import path from 'path';

export async function generateRemote(appOptions: IQuestionInit): Promise<void> {
	const projectPath = execSync('pwd').toString().replace(/\n/g, '');
	let bitoviConfig = null;

	try {
		bitoviConfig = JSON.parse(
			JSON.stringify(fs.readFileSync(`${projectPath}/bi.json`).toString()),
		);
	} catch (e) {
		console.error('You are not inside a bitovi project', e);
	}

	const createMainApp = `cd ./apps && ng new ${appOptions.projectName} --routing --style=${appOptions.style} --skip-git --skip-install && cd ..`;
	const remoteFiles = `rm -rf ./${appOptions.projectName}/package.json && rm -rf ./${appOptions.projectName}/.vscode`;

	execSync(
		`${createMainApp} && ${remoteFiles} && cd ./apps/${appOptions.projectName} && ng g @bitovi/bi:bi --port=4201`,
	);
	bitoviConfig = JSON.parse(bitoviConfig);
	bitoviConfig.apps[appOptions.projectName] = `apps/${appOptions.projectName}`;

	await writeFile(
		path.join(projectPath, 'bi.json'),
		JSON.stringify(bitoviConfig),
		'utf8',
	);
}
