import 'jasmine';
import { IQuestionInit } from '.';
import { questionsToInitProject } from './cli-questions';

describe('cli-questions', () => {
    let questions: Promise<IQuestionInit>;
    let args: IQuestionInit;
    beforeEach(() => {
    });

    it('returns an object with project name and style given arguments', () => {
        questions = questionsToInitProject(args);
        questions.then(value => {
            console.log(value);
        })
    });
})