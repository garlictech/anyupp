import {
  normalizeDish,
  processProducts,
  validateDish,
} from './process-products';
import * as cartJson from './cart-fixture.json';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';

test('processProducts good case', () => {
  expect(processProducts(cartJson)).toMatchSnapshot();
});

const dishFixture = {
  type: 'dish',
  modiweight: 0,
  price: 50000,
  modischeme: 0,
  active: 0,
  id: 1000114,
  guid: '4b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba ital',
};

test('Dish validator', done => {
  validateDish(dishFixture)
    .pipe(
      tap(res => expect(res).toMatchSnapshot('GOOD CASE')),
      tap(res => expect(normalizeDish(res)).toMatchSnapshot('NORMALIZE')),
      switchMap(() =>
        validateDish({
          ...dishFixture,
          price: -1,
          id: '2232',
          name: undefined,
        }),
      ),
      catchError(of),
      tap(res => expect(res).toMatchSnapshot('BAD CASE')),
      take(1),
    )
    .subscribe(() => done());
});
