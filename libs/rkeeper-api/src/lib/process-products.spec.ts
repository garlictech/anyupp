import * as fixtures from './fixtures';
import {
  externalProductIdMaker,
  normalizeDish,
  processDishes,
  validateDish,
} from './process-products';
import { tap, take } from 'rxjs/operators';

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

test('Dish validator - good case', done => {
  validateDish(dishFixture)
    .pipe(
      tap(res => expect(res).toMatchSnapshot('GOOD CASE')),
      tap(res => expect(normalizeDish(res)).toMatchSnapshot('NORMALIZE')),
      take(1),
    )
    .subscribe(() => done());
});

test('Dish validator - bad case', done => {
  validateDish({
    ...dishFixture,
    price: -1,
    id: '2232',
    name: undefined,
  }).subscribe({
    error: err => {
      expect(err).toMatchSnapshot();
      done();
    },
  });
});

test('externalProductIdMaker test', () => {
  expect(externalProductIdMaker('GUID')).toMatchSnapshot();
});

test('processDishes items with equal ids', done => {
  processDishes({ data: { dishes: [dishFixture, dishFixture] } })
    .pipe(tap(result => expect(result).toMatchSnapshot()))
    .subscribe(() => done());
});

test('processDishes items with different ids', done => {
  processDishes({
    data: { dishes: [dishFixture, { ...dishFixture, id: 21312321 }] },
  })
    .pipe(tap(result => expect(result).toMatchSnapshot()))
    .subscribe(() => done());
});

test('processDishes must work on the fixture', done => {
  processDishes(fixtures.rawData).subscribe({
    next: result => {
      expect(result).toMatchSnapshot();
      done();
    },
  });
});
