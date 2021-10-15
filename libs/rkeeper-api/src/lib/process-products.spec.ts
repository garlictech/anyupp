import { processProducts } from './process-products';
import * as cartJson from './cart-fixture.json';

test('processProducts good case', () => {
  expect(processProducts(cartJson)).toMatchSnapshot();
});
