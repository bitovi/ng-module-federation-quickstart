import * as chai from 'chai';
import { spy } from 'sinon';
import { cli } from '../src/cli';

xdescribe('cli', () => {
  it('generateRemote', () => {
    const sinonSpy = spy(cli);
    sinonSpy({});
    chai.expect(sinonSpy.threw()).to.equal(true);
    chai.expect(sinonSpy.calledWith({})).to.equal(true);
  });
});
