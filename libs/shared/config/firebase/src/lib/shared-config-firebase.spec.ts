import { sharedConfigFirebase } from './shared-config-firebase';

describe('sharedConfigFirebase', () => {
  it('should work', () => {
    expect(sharedConfigFirebase()).toEqual('shared-config-firebase');
  });
});
