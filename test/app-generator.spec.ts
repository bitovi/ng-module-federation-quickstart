import * as chai from "chai";
import { spy, stub } from "sinon";
import { IQuestionInit } from "../src/cli-questions";
// import { spies } from 'sinon-chai';
import { generateRemote } from "../src/generators/apps/app-generator";

xdescribe("app-generator", () => {
  it("generateRemote", () => {
    const appOptions: IQuestionInit = { style: "css", projectName: "test" };
    const sinonSpy = spy(generateRemote);
    sinonSpy(appOptions);
    chai.expect(sinonSpy.threw()).to.equal(true);
    chai.expect(sinonSpy.calledWith(appOptions)).to.equal(true);

    // sinonSpy.
  });
});
