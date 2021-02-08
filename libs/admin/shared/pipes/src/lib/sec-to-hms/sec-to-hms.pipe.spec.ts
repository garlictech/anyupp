import { SecToHmsPipe } from './sec-to-hms.pipe';

xdescribe('SecToHmsPipe', (): void => {
  it('create an instance', (): void => {
    const pipe = new SecToHmsPipe();
    expect(pipe).toBeTruthy();
  });
});
