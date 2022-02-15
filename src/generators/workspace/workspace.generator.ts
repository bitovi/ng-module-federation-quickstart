import { IQuestionInit } from '../../cli-questions';
import execa from 'execa';
import { execSync } from 'child_process';

export async function generateNewWorkspace(initOptions: IQuestionInit) {
	execSync(`mkdir ${initOptions.projectName}`);
	execSync(
		`cd ${initOptions.projectName} & ng new ${initOptions.projectName}  --no-interactive`,
	);
}
