import { SecToHmsPipe } from './sec-to-hms.pipe';

xdescribe('SecToHmsPipe', () => {
  it('create an instance', () => {
    const pipe = new SecToHmsPipe();
    expect(pipe).toBeTruthy();
  });
});
