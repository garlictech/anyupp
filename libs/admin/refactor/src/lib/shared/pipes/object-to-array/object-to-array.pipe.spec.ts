import { ObjectToArrayPipe } from './object-to-array.pipe';

xdescribe('ObjectToArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new ObjectToArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
