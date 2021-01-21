import { sharedConfigStripe } from './shared-config-stripe';

describe('sharedConfigStripe', () => {
  it('should work', () => {
    expect(sharedConfigStripe()).toEqual('shared-config-stripe');
  });
});
