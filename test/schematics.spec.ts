import * as chai from 'chai';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { spy } from 'sinon';
import { bitovi } from '../src/generators/schematics/bi/bi';

describe('bitovi', () => {
  it('returns a rule', () => {
    const spies = require('sinon-chai');
    chai.use(spies);
    const sinonSpy = spy(bitovi);
    const expected: Rule = () => {
      return (tree: Tree, _context: SchematicContext) => {
        return tree;
      };
    };
    sinonSpy({});
    chai.expect(sinonSpy.calledWith({})).to.equal(true);
    console.log('values return', sinonSpy.returnValues[0]);
    console.log('values expec', expected);
    // chai.expect(sinonSpy.returnValues[0]).to.be.a.;
  });
});
