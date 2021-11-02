import * as fixtures from './fixtures';
import {
  decodeName,
  Dish,
  externalProductIdMaker,
  normalizeDish,
  normalizeModifierGroup,
  processDishes,
  resolveComponentSets,
  validateDish,
  validateModifierGroup,
} from './process-products';
import { tap, take } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

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

test('ModifyerGroup validator - good case', done => {
  validateModifierGroup({
    id: 1017199,
    name: '2dl pap\u00EDrpoh\u00E1r',
    modifiers: [
      {
        price: 5000,
        name: 'Pap\u00EDrpoh\u00E1r 2dl',
        active: 1,
        id: 1011504,
      },
      {
        price: 0,
        name: 'Saj\u00E1t poh\u00E1r',
        active: 1,
        id: 1011517,
      },
    ],
  })
    .pipe(
      tap(res => expect(res).toMatchSnapshot('GOOD CASE')),
      tap(res =>
        expect(normalizeModifierGroup(res)).toMatchSnapshot('NORMALIZE'),
      ),
      take(1),
    )
    .subscribe(() => done());
});

test('ModifierGroup validator - bad case', done => {
  validateModifierGroup({
    id: '1017199',
    name: undefined,
    modifiers: [
      {
        price: undefined,
        name: 'Pap\u00EDrpoh\u00E1r 2dl',
        active: 1,
        id: 1011504,
      },
      {
        price: 0,
        name: undefined,
        active: 1,
        id: 1011517,
      },
    ],
  }).subscribe({
    error: err => {
      expect(err).toMatchSnapshot();
      done();
    },
  });
});

const useCases = [
  {
    label: 'create new components',
    sdk: {
      SearchProductComponentSets: jest
        .fn()
        .mockReturnValue(of({ items: null })),
      SearchProductComponents: jest.fn().mockReturnValue(of({ items: null })),
      CreateProductComponent: jest.fn().mockReturnValue(
        of({
          id: 'NEW PRODUCT COMPONENT ID',
        }),
      ),
      CreateProductComponentSet: jest.fn().mockReturnValue(
        of({
          id: 'NEW PRODUCT COMPONENT SET ID',
        }),
      ),
      UpdateProductComponentSet: jest.fn(),
      UpdateProductComponent: jest.fn(),
    },
  },
  {
    label: 'update old components',
    sdk: {
      SearchProductComponentSets: jest.fn().mockReturnValue(
        of({
          items: [
            {
              id: 'THE OLD PRODUCT COMPONENT SET ID',
            },
          ],
        }),
      ),
      SearchProductComponents: jest.fn().mockReturnValue(
        of({
          items: [
            {
              id: 'THE OLD PRODUCT COMPONENT ID',
            },
          ],
        }),
      ),
      UpdateProductComponent: jest.fn().mockReturnValue(
        of({
          id: 'THE NEW PRODUCT COMPONENT ID',
        }),
      ),
      UpdateProductComponentSet: jest.fn().mockReturnValue(
        of({
          id: 'THE NEW PRODUCT COMPONENT SET ID',
        }),
      ),
      CreateProductComponentSet: jest.fn(),
      CreateProductComponent: jest.fn(),
    },
  },
  {
    label: 'SearchProductComponentSet fails',
    sdk: {
      SearchProductComponentSets: jest
        .fn()
        .mockReturnValue(throwError('SearchProductComponentSets error')),
      SearchProductComponents: jest.fn().mockReturnValue(of({ items: null })),
      CreateProductComponent: jest.fn().mockReturnValue(
        of({
          id: 'NEW PRODUCT COMPONENT ID',
        }),
      ),
      CreateProductComponentSet: jest.fn().mockReturnValue(
        of({
          id: 'NEW PRODUCT COMPONENT SET ID',
        }),
      ),
      UpdateProductComponentSet: jest.fn(),
      UpdateProductComponent: jest.fn(),
    },
  },
  {
    label: 'CreateProductComponent fails',
    sdk: {
      SearchProductComponentSets: jest
        .fn()
        .mockReturnValue(of({ items: null })),
      SearchProductComponents: jest.fn().mockReturnValue(of({ items: null })),
      CreateProductComponent: jest
        .fn()
        .mockReturnValue(throwError('CreateProductComponent error')),
      CreateProductComponentSet: jest.fn().mockReturnValue(
        of({
          id: 'NEW PRODUCT COMPONENT SET ID',
        }),
      ),
      UpdateProductComponentSet: jest.fn(),
      UpdateProductComponent: jest.fn(),
    },
  },
];

test.only.each(useCases)('resolveComponentSets', async ({ label, sdk }) => {
  const dishWithModifier: Dish = await validateDish(
    fixtures.dishWithModifier,
  ).toPromise();

  expect(
    await resolveComponentSets(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sdk as any,
      'CHAINID',
      fixtures.rawDataWithModifiers,
    )(dishWithModifier).toPromise(),
  ).toMatchSnapshot(`the sets (${label}) `);

  expect(sdk.SearchProductComponents.mock.calls).toMatchSnapshot(
    `SearchProductComponents calls (${label})`,
  );
  expect(sdk.SearchProductComponentSets.mock.calls).toMatchSnapshot(
    `SearchProductComponentSets calls (${label})`,
  );
  expect(sdk.CreateProductComponent.mock.calls).toMatchSnapshot(
    `CreateProductComponent calls (${label})`,
  );
  expect(sdk.CreateProductComponentSet.mock.calls).toMatchSnapshot(
    `CreateProductComponentSet calls (${label})`,
  );
  expect(sdk.UpdateProductComponent.mock.calls).toMatchSnapshot(
    `UpdateProductComponent calls (${label})`,
  );
  expect(sdk.UpdateProductComponentSet.mock.calls).toMatchSnapshot(
    `UpdateProductComponentSet calls (${label})`,
  );
});

test('decodeName', () => {
  expect(decodeName('Saj\u00E1t poh\u00E1r')).toMatchSnapshot();
});
