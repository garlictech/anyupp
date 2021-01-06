import { ObjectToArrayPipe } from './object-to-array.pipe';

describe('ObjectToArrayPipe', (): void => {
  it('create an instance', (): void => {
    const pipe = new ObjectToArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
