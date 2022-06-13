import { baseFromTaxedPrice, taxedFromBasePrice } from './products';

describe('Product fee calculation tests', () => {
  it('should calculate basePreice from taxedPrice', () => {
    expect(baseFromTaxedPrice(1270, 27)).toMatchInlineSnapshot(`1000`);
    expect(baseFromTaxedPrice(1500, 27)).toMatchInlineSnapshot(`1181.1024`);
    expect(baseFromTaxedPrice(1270, 0)).toMatchInlineSnapshot(`1270`);
  });

  it('should calculate taxedPrice from basePreice', () => {
    expect(taxedFromBasePrice(1000, 27)).toMatchInlineSnapshot(`1270`);
    expect(taxedFromBasePrice(1500, 27)).toMatchInlineSnapshot(`1905`);
    expect(taxedFromBasePrice(2000, 0)).toMatchInlineSnapshot(`2000`);
  });
});
