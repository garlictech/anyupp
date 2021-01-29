import { CurrencyFormatterPipe } from './currency-formatter.pipe';

describe('CurrencyFormatterPipe', (): void => {
  it('create an instance', (): void => {
    const pipe = new CurrencyFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
