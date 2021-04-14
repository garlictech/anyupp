import {
  AmplifyApi,
  AmplifyApiQueryDocuments,
} from 'libs/admin/amplify-api/src';
import { validateUnitProduct } from 'libs/shared/data-validators/src';
import { IProduct } from 'libs/shared/types/src';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AppsyncApi } from '@bgap/api/graphql/schema';
import {
  appsyncGraphQlClient,
  AuthenticatdGraphQlClientWithUserId,
  createAuthenticatedAppsyncGraphQlClient,
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';

import {
  testAdminUsername,
  testAdminUserPassword,
  unitProductSeed,
} from '../../../fixtures';

const input: AppsyncApi.CreateUnitProductMutationVariables = {
  input: unitProductSeed.unitProduct_01,
} as any;

describe('CreateUnitProduct tests', () => {
  it('should require authentication to access', done => {
    return executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateUnitProductMutation
    >(AppsyncApi.CreateUnitProduct, input).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 25000);

  describe.only('with authenticated user', () => {
    let authHelper: AuthenticatdGraphQlClientWithUserId;

    beforeAll(async () => {
      authHelper = await createAuthenticatedAppsyncGraphQlClient(
        testAdminUsername,
        testAdminUserPassword,
      ).toPromise();
      console.warn(authHelper.userAttributes);
    });
    // let authenticatedApsyncGraphQlClient;
    // beforeAll(async () => {
    //   authenticatedApsyncGraphQlClient = createAuthenticatedAppsyncGraphQlClient()
    //   await combineLatest([
    //     // CleanUP
    //     // deleteTestCart(),
    //     // deleteTestCart(cartWithNotExistingUNIT),
    //   ])
    //     .pipe(
    //       switchMap(() =>
    //         // Seeding
    //         combineLatest([
    //           // createTestCart(),
    //           // createTestCart({
    //           //   id: cartWithNotExistingUNIT,
    //           //   unitId: unitSeed.unitId_NotExisting,
    //           // }),
    //         ]),
    //       ),
    //     )
    //     .toPromise();
    // }

    // it('should .... with authenticated user', done => {
    //   // return executeMutation(authHelper.graphQlClient)<
    //   //   AppsyncApi.CreateUnitProductMutation
    //   // >(AppsyncApi.CreateUnitProduct, input)
    //   from(productRequestHandler.createUnitProduct(amplifyGraphQlClient)(input))
    //     .pipe(
    //       pipeDebug('### UNITPRODUCT CREATE RESULT'),
    //       // map(result => result.createUnitProduct),
    //       // switchMap(product =>
    //       //   // getUnitProduct(amplifyGraphQlClient, product.id),
    //       // ),
    //     )
    //     .subscribe({
    //       next(result) {
    //         console.log(
    //           '### ~ file: create-unit-product.spec.ts ~ line 69 ~ next ~ result',
    //           JSON.stringify(result, undefined, 2),
    //         );
    //         expect(result).toMatchSnapshot();

    //         done();
    //       },
    //     });
    // });
  });
});

// const getUnitProduct = (
//   amplifyApiClient: GraphqlApiClient,
//   productId: string,
// ): Observable<IProduct> => {
//   return executeQuery(amplifyApiClient)<AmplifyApi.GetUnitProductQuery>(
//     AmplifyApiQueryDocuments.getUnitProduct,
//     { id: productId },
//   ).pipe(
//     map(product => product.getUnitProduct),
//     switchMap(validateUnitProduct),
//   );
// };
