import { CurrencyFormatterPipe } from './currency-formatter.pipe';

xdescribe('CurrencyFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
