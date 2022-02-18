/* eslint-disable @typescript-eslint/no-explicit-any */
import { from, of, throwError } from 'rxjs';
import { mergeMap, tap, toArray } from 'rxjs/operators';

import * as utils from './utils';

const getAllParentsOfUnitProductCases = [
  {
    getUnitProductResult: of(undefined),
    getGroupProductResult: of(undefined),
    getChainProductResult: of(undefined),
    label: 'undefined unit',
  },
  {
    getUnitProductResult: throwError('UNIT FETCHING ERROR'),
    getGroupProductResult: of(undefined),
    getChainProductResult: of(undefined),
    label: 'failed unit',
  },
  {
    getUnitProductResult: of({ parentId: 'GROUP PRODUCT ID 1' }),
    getGroupProductResult: of(undefined),
    getChainProductResult: of(undefined),
    label: 'undefined group',
  },
  {
    getUnitProductResult: of({ parentId: 'GROUP PRODUCT ID 2' }),
    getGroupProductResult: throwError('GROUP FETCHING ERROR'),
    getChainProductResult: of(undefined),
    label: 'failed group',
  },
  {
    getUnitProductResult: of({ parentId: 'GROUP PRODUCT ID 3' }),
    getGroupProductResult: of({ parentId: 'CHAIN PRODUCT ID 1' }),
    getChainProductResult: of(undefined),
    label: 'undefined chain',
  },
  {
    getUnitProductResult: of({ parentId: 'GROUP PRODUCT ID 4' }),
    getGroupProductResult: of({ parentId: 'CHAIN PRODUCT ID 2' }),
    getChainProductResult: throwError('CHAIN PRODUCT FETCH ERROR'),
    label: 'failed chain',
  },
  {
    getUnitProductResult: of({ parentId: 'GROUP PRODUCT ID 5' }),
    getGroupProductResult: of({ parentId: 'CHAIN PRODUCT ID 3' }),
    getChainProductResult: of({ id: 'CHAIN PRODUCT ID 3' }),
    label: 'all found',
  },
];

test.each(getAllParentsOfUnitProductCases)(
  'getAllParentsOfUnitProduct case: $label',
  (
    {
      getUnitProductResult,
      getGroupProductResult,
      getChainProductResult,
      label,
    },
    done: any,
  ) => {
    const sdk = {
      GetUnitProduct: jest.fn().mockReturnValue(getUnitProductResult),
      GetGroupProduct: jest.fn().mockReturnValue(getGroupProductResult),
      GetChainProduct: jest.fn().mockReturnValue(getChainProductResult),
    } as any;

    utils
      .getAllParentsOfUnitProduct(sdk)(`UNIT PRODUCT ID for ${label}`)
      .pipe(
        tap(res => {
          expect(sdk.GetUnitProduct.mock.calls).toMatchSnapshot(
            'GetUnitProduct DEPS CALLS',
          );
          expect(sdk.GetGroupProduct.mock.calls).toMatchSnapshot(
            'GetGroupProduct DEPS CALLS',
          );
          expect(sdk.GetChainProduct.mock.calls).toMatchSnapshot(
            'GetChainProduct DEPS CALLS',
          );
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(done());
  },
);

test('getAllParentsOfUnitProduct: test memoization', done => {
  const sdk = {
    GetUnitProduct: jest
      .fn()
      .mockReturnValue(of({ parentId: 'GROUP PRODUCT ID 5' })),
    GetGroupProduct: jest
      .fn()
      .mockReturnValue(of({ parentId: 'CHAIN PRODUCT ID 3' })),
    GetChainProduct: jest
      .fn()
      .mockReturnValue(of({ id: 'CHAIN PRODUCT ID 3' })),
  } as any;

  // For memoization, each SDK calls should be called only once
  from([1, 2])
    .pipe(
      mergeMap(() => utils.getAllParentsOfUnitProduct(sdk)(`UNIT PRODUCT ID`)),
      toArray(),
      tap(() => {
        expect(sdk.GetUnitProduct.mock.calls).toMatchSnapshot(
          'GetUnitProduct DEPS CALLS',
        );
        expect(sdk.GetGroupProduct.mock.calls).toMatchSnapshot(
          'GetGroupProduct DEPS CALLS',
        );
        expect(sdk.GetChainProduct.mock.calls).toMatchSnapshot(
          'GetChainProduct DEPS CALLS',
        );
      }),
    )
    .subscribe(done());
});

const getGeneratedProductCases = [
  {
    result: of(undefined),
    label: 'undefined product',
  },
  {
    result: throwError('FETCHING ERROR'),
    label: 'failed fetch',
  },
  {
    result: of({ id: 'GENERATED PRODUCT ID 5' }),
    label: 'all good',
  },
];

test.each(getGeneratedProductCases)(
  'getGeneratedProduct case: $label',
  ({ result, label }, done: any) => {
    const sdk = {
      GetGeneratedProduct: jest.fn().mockReturnValue(result),
    } as any;

    utils
      .getGeneratedProduct(sdk)(`PRODUCT ID for ${label}`)
      .pipe(
        tap(res => {
          expect(sdk.GetGeneratedProduct.mock.calls).toMatchSnapshot(
            'GetGeneratedProducte DEPS CALLS',
          );
          expect(res).toMatchSnapshot('RESULT');
        }),
      )
      .subscribe(done());
  },
);
