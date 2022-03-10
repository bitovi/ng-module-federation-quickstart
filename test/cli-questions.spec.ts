import * as chai from 'chai';
import { spy, stub } from 'sinon';
import { questionsToInitProject } from '../src/cli-questions/cli-questions';
import inquirer from 'inquirer';
import { IQuestionInit } from '../src/core';
describe('cli-questions', () => {
  let args: IQuestionInit;

  it('returns an object with project name and style given arguments', () => {
    const expect = chai.expect;
    const sinonSpy = spy(questionsToInitProject);
    args = { projectName: 'test', style: 'css' };
    sinonSpy(args);
    stub(inquirer, 'prompt').withArgs([]).returns(null);
    sinonSpy(args).then((res) => {
      expect(res).to.equal(args);
    });
    expect(sinonSpy.calledWith(args)).to.equal(true);
  });
});
