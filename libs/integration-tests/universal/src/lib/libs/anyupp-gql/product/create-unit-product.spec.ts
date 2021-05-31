import { combineLatest, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';

import {
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { deleteTestUnitProduct } from '../../../seeds/unit-product';
import { AnyuppSdk, getAnyuppSdkPublic } from '@bgap/anyupp-gql/api';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';

const input: AnyuppApi.CreateUnitProductMutationVariables = {
  input: productFixture.unitProductBase,
} as any;

describe('CreateUnitProduct tests', () => {
  let publicAnyuppSdk: AnyuppSdk;
  let authAnyuppSdk: AnyuppSdk;
  let publicCrudSdk: CrudApi.CrudSdk;
  let iamCrudSdk: CrudApi.CrudSdk;

  beforeAll(async () => {
    publicAnyuppSdk = getAnyuppSdkPublic();
    authAnyuppSdk = await createAuthenticatedAnyuppSdk(
      testAdminUsername,
      testAdminUserPassword,
    )
      .toPromise()
      .then(x => x.authAnyuppSdk);
    publicCrudSdk = CrudApi.getCrudSdkPublic();
    iamCrudSdk = createIamCrudSdk();
  });

  it('should require authentication to access', done => {
    return publicAnyuppSdk.CreateUnitProduct(input).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 25000);

  describe('with authenticated user', () => {
    // let authenticatedApsyncGraphQLClient;
    beforeAll(async () => {
      await combineLatest([
        // CleanUP
        deleteTestUnitProduct(input.input.id, iamCrudSdk),
      ])
        // .pipe(
        //   switchMap(() =>
        //     // Seeding
        //     // combineLatest([
        //       // createTestCart(),
        //       // createTestCart({
        //       //   id: cartWithNotExistingUNIT,
        //       //   unitId: unitSeed.unitId_NotExisting,
        //       // }),
        //     // ]),
        //   ),
        // )
        .toPromise();
    });

    // PROBABLY THIS FEATURE WON'T BE USED !!!
    it.skip('should create unitProduct in the database', done => {
      return (
        authAnyuppSdk
          .CreateUnitProduct(input)
          // from(productRequestHandler.createUnitProduct(crudGraphqlClient)(input))
          .pipe(
            // pipeDebug('### UNITPRODUCT CREATE RESULT'),
            switchMap(product => getUnitProduct(publicCrudSdk, product.id)),
          )
          .subscribe({
            next(result) {
              // console.log(
              //   '### ~ file: create-unit-product.spec.ts ~ line 69 ~ next ~ result',
              //   JSON.stringify(result, undefined, 2),
              // );
              const { createdAt, updatedAt, ...product } = result;
              expect(createdAt).not.toBeUndefined();
              expect(updatedAt).not.toBeUndefined();
              expect(product).toMatchSnapshot();

              done();
            },
          })
      );
    }, 25000);
  });
});

const getUnitProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetUnitProduct({ id: productId }).pipe(
    switchMap(validateUnitProduct),
    catchError(err => {
      console.error(err);
      return throwError('Unit is missing');
    }),
  );
};
