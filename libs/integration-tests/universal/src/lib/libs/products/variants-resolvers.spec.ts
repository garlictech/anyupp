import {
  CrudSdk,
  getCrudSdkForIAM,
  Variant,
  UnitProduct,
  ProductType,
  deleteUnitProductWithVariants,
} from '@bgap/crud-gql/api';
import { tap, map, switchMap, delay } from 'rxjs/operators';
import {} from '@bgap/domain';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { maskDate, maskAll, sanitizeField } from '@bgap/shared/fixtures';
import { of } from 'rxjs';

describe('Product variants resolver tests', () => {
  let sdk: CrudSdk;

  const variantFixture: ProductVariantInput = {
    isAvailable: true,
    price: 10,
    variantName: { en: 'Variant name' },
    position: 1,
  };

  const unitProductFixture = {
    unitId: '',
    isVisible: true,
    id: 'product_variants_c93e2c8e-b088-4885-993e-7d48d9f9d252',
    position: 1,
    __operation: 'Mutation',
    variants: [variantFixture],
    name: { en: 'UNIT NAME' },
    tax: 0,
    productCategoryId: 'PRODUCT CAT ID',
    productType: ProductType.dish,
  };

  const createUnitProductFixture: CreateUnitProductInput = R.omit([
    '__operation',
  ])(unitProductFixture);

  const cleanup = (product?: UnitProduct | null) =>
    product ? deleteUnitProductWithVariants(product, sdk) : of({});

  beforeAll(async () => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    sdk = getCrudSdkForIAM(accessKeyId, secretAccessKey);
  }, 10000);

  afterEach(async () => {
    await of(1).pipe(delay(3000)).toPromise();
  });

  test('CreateUnitProduct with API call', async () => {
    await sdk
      .CreateUnitProduct({ input: createUnitProductFixture })
      .pipe(
        tap(result => expect(maskAll(result)).toMatchSnapshot()),
        delay(3000),
        tap(console.warn),
        switchMap(cleanup),
      )
      .toPromise();
  }, 10000);

  test('UpdateUnitProduct with API call', async () => {
    let testedVariantId: string | undefined = 'foobar';
    let productId: string | null | undefined;

    await sdk
      .CreateUnitProduct({ input: createUnitProductFixture })
      .pipe(
        tap(result => {
          expect(result).toBeDefined();
          expect(result?.variants?.items?.[0]).toBeDefined();
          expect(result?.variants?.items?.length).toEqual(1);
          testedVariantId = result?.variants?.items?.[0]?.id;
          productId = result?.id;
        }),
        map(result => result as UnitProduct),
        delay(3000),
        switchMap(result =>
          sdk.UpdateVariant({
            input: {
              id: result?.variants?.items?.[0]?.id ?? 'wtf',
              variantName: { en: 'NEW VARIANT NAME' },
            },
          }),
        ),
        tap(result => expect(maskAll(result)).toMatchSnapshot()),
        // Check if the updated variant is really updated, not a new one by
        // comparing the id-s
        tap(result => expect(result?.id).toEqual(testedVariantId)),
        // Check duplication - a simple update should not duplicate the variants
        switchMap(() =>
          sdk.UpdateUnitProduct({
            input: {
              id: productId ?? 'wtf',
              isVisible: false,
            },
          }),
        ),
        delay(3000),
        switchMap(() => sdk.GetUnitProduct({ id: productId ?? 'wtf' })),
        tap(result => expect(result?.variants?.length).toEqual(1)),
        switchMap(cleanup),
      )
      .toPromise();
  }, 20000);

  test('GetUnitProduct with API call', async () => {
    await sdk
      .CreateUnitProduct({ input: createUnitProductFixture })
      .pipe(
        delay(3000),
        switchMap(() => sdk.GetUnitProduct({ id: unitProductFixture.id })),
        tap(result => expect(maskAll(result)).toMatchSnapshot()),
        switchMap(cleanup),
      )
      .toPromise();
  }, 10000);
});
