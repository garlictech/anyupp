import {
  CrudSdk,
  getCrudSdkForIAM,
  Variant,
  CreateUnitProductInput,
  ProductVariantInput,
  UnitProduct,
  ProductType,
} from '@bgap/crud-gql/api';
import { productVariantsResolver } from '@bgap/backend/products';
import { tap, map, switchMap, delay } from 'rxjs/operators';
import {} from '@bgap/domain';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { maskDate, maskAll, sanitizeField } from '@bgap/shared/fixtures';
import { deleteUnitProductWithVariants } from '../../seeds/unit-product';
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

  test('CreateUnitProduct with direct resolver', async () => {
    await productVariantsResolver({ crudSdk: sdk })({}, unitProductFixture)
      .pipe(
        tap(result =>
          expect(
            pipe(result, maskDate, sanitizeField([0, 'id'])),
          ).toMatchSnapshot('CREATE PRODUCT'),
        ),
        delay(3000),
        switchMap(() =>
          productVariantsResolver({ crudSdk: sdk })(
            {},
            {
              id: unitProductFixture.id,
            },
          ),
        ),
        tap(result =>
          expect(
            pipe(result, maskDate, sanitizeField([0, 'id'])),
          ).toMatchSnapshot('GET PRODUCT'),
        ),
        switchMap(cleanup),
      )
      .toPromise();
  }, 10000);

  test('CreateUnitProduct with API call', async () => {
    await sdk
      .CreateUnitProduct({ input: createUnitProductFixture })
      .pipe(
        tap(result => expect(maskAll(result)).toMatchSnapshot()),
        switchMap(cleanup),
      )

      .toPromise();
  }, 10000);

  test('UpdateUnitProduct with API call', async () => {
    let testedVariantId: string | undefined = 'foobar';

    await sdk
      .CreateUnitProduct({ input: createUnitProductFixture })
      .pipe(
        tap(result => expect(result).toBeDefined()),
        tap(result => expect(result?.variants?.[0]).toBeDefined()),
        tap(result => (testedVariantId = result?.variants?.[0]?.id)),
        map(result => result as UnitProduct),
        delay(3000),
        switchMap(result =>
          sdk.UpdateUnitProduct({
            input: {
              id: result.id,
              variants: [
                {
                  ...(result?.variants?.[0] as Variant),
                  variantName: { en: 'NEW VARIANT NAME' },
                },
              ],
            },
          }),
        ),
        tap(result => expect(maskAll(result)).toMatchSnapshot()),
        // Check if the updated variant is really updated, not a new one by
        // comparing the id-s
        tap(result =>
          expect(result?.variants?.[0]?.id).toEqual(testedVariantId),
        ),
        switchMap(cleanup),
      )
      .toPromise();
  }, 10000);

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
