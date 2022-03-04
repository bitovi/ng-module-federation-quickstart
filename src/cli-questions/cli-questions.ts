import inquirer, { QuestionCollection } from 'inquirer';
import { AngularAcceptedStyles, IQuestionInit } from '../core';

export async function questionsToInitProject(args: IQuestionInit): Promise<IQuestionInit> {
  const acceptedStyles: string[] = Object.values(AngularAcceptedStyles);
  const questions: QuestionCollection<any>[] = [];

  if (!args.projectName || args.projectName?.length <= 0) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Please choose the name of your new workspace',
    });
  }

  if (!acceptedStyles.includes(args.style)) {
    questions.push({
      type: 'list',
      name: 'style',
      message: 'Please choose the syntax to use to write styles',
      choices: acceptedStyles,
      default: 'css',
    });
  }

  const answers: Partial<IQuestionInit> = await inquirer.prompt(questions);

  return {
    projectName: args.projectName?.length > 0 ? args.projectName : answers.projectName,
    style: acceptedStyles.includes(args.style) ? args.style : answers.style,
  };
}
