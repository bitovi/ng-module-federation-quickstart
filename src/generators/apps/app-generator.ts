import { execSync, exec } from 'child_process';
import fs from 'fs';
import { IQuestionInit } from '../../cli-questions';
import path from 'path';

export async function generateRemote(appOptions: IQuestionInit): Promise<void> {
	const projectPath = path.join(process.cwd());
	let bitoviConfig = null;

	try {
		bitoviConfig = JSON.parse(
			JSON.stringify(fs.readFileSync(`${projectPath}/bi.json`).toString()),
		);
	} catch (e) {
		console.error('You are not inside a bitovi project', e);
	}

	const createMainApp = `cd ${projectPath}/apps && ng new ${appOptions.projectName} --routing --style=${appOptions.style} --skip-git --skip-install && cd ..`;
	const createdApps = fs.readdirSync(path.join(projectPath, `apps`));

	execSync(
		`${createMainApp} && cd ${projectPath}/apps/${
			appOptions.projectName
		} && ng g @bitovi/bi:bi  --port=420${
			createdApps.length + 1
		} --projectName=${appOptions.projectName} --remote`,
	);
	bitoviConfig = JSON.parse(bitoviConfig);
	bitoviConfig.apps[appOptions.projectName] = `apps/${appOptions.projectName}`;

	fs.writeFileSync(
		path.join(projectPath, 'bi.json'),
		JSON.stringify(bitoviConfig),
	);
}
