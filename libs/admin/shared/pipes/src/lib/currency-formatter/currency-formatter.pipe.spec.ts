import { CurrencyFormatterPipe } from './currency-formatter.pipe';

xdescribe('CurrencyFormatterPipe', (): void => {
  it('create an instance', (): void => {
    const pipe = new CurrencyFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
