import inquirer, { QuestionCollection } from 'inquirer';
import { IQuestionInit } from './cli-questions.interface';

export async function questionsToInitProject(args: IQuestionInit): Promise<IQuestionInit> {
  const acceptedStyles = ['css', 'scss'];
  const questions: QuestionCollection<any>[] = [];

  if (args.projectName.length <= 0) {
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

  const answers = await inquirer.prompt(questions);

  return {
    projectName: args.projectName.length > 0 ? args.projectName : answers.projectName,
    style: acceptedStyles.includes(args.style) ? args.style : answers.style,
  };
}
