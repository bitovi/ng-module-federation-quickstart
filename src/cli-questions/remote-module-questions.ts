import inquirer, { QuestionCollection } from 'inquirer';
import { IBitoviConfig, IBiWorkspace, IQuestionsRemoteModule } from '../core';
import { getExistingBiConfig } from '../generators';

export async function questionsToRemoteModule(
  args: IQuestionsRemoteModule
): Promise<IQuestionsRemoteModule> {
  const questions: QuestionCollection<any>[] = [];
  const workspace: IBitoviConfig = getExistingBiConfig().biConfig;

  const remoteApps: string[] = Object.keys(workspace.apps).filter(
    (app: string) => app !== workspace.host
  );

  if (!args.projectName || !remoteApps.includes(args.projectName)) {
    questions.push({
      type: 'list',
      name: 'projectName',
      message: 'Please choose the remote app you want to add the new module to',
      choices: remoteApps,
    });
  }

  if (!args.remoteModule) {
    questions.push({
      type: 'input',
      name: 'remoteModule',
      message: 'How do you want to name the new module?',
    });
  }

  const answers: Partial<IQuestionsRemoteModule> = await inquirer.prompt(questions);

  const result = {
    remoteModule: args.remoteModule?.length > 0 ? args.remoteModule : answers.remoteModule,
    projectName: remoteApps.includes(args.projectName) ? args.projectName : answers.projectName,
  };

  return result;
}
