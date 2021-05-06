import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import {
  crudGraphqlClient,
  anyuppGraphQLClient,
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedAnyuppGraphQLClient,
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IUnitProduct } from '@bgap/shared/types';

import {
  testAdminUsername,
  testAdminUserPassword,
  unitProductSeed,
} from '../../../fixtures';
import { deleteUnitProduct } from '../../../seeds/unit-product';

const input: AnyuppApi.CreateUnitProductMutationVariables = {
  input: unitProductSeed.unitProduct_01,
} as any;

describe('CreateUnitProduct tests', () => {
  it('should require authentication to access', done => {
    return executeMutation(anyuppGraphQLClient)<
      AnyuppApi.CreateUnitProductMutation
    >(AnyuppApi.CreateUnitProduct, input).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 25000);

  describe('with authenticated user', () => {
    let authHelper: AuthenticatdGraphQLClientWithUserId;

    beforeAll(async () => {
      authHelper = await createAuthenticatedAnyuppGraphQLClient(
        testAdminUsername,
        testAdminUserPassword,
      ).toPromise();
      console.warn(authHelper.userAttributes);
    });
    // let authenticatedApsyncGraphQLClient;
    beforeAll(async () => {
      await combineLatest([
        // CleanUP
        deleteUnitProduct(input.input.id),
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

    it.skip('should create unitProduct in the database', done => {
      return (
        executeMutation(authHelper.graphQlClient)<
          AnyuppApi.CreateUnitProductMutation
        >(AnyuppApi.CreateUnitProduct, input)
          // from(productRequestHandler.createUnitProduct(crudGraphqlClient)(input))
          .pipe(
            // pipeDebug('### UNITPRODUCT CREATE RESULT'),
            map(result => result.createUnitProduct),
            switchMap(product => getUnitProduct(crudGraphqlClient, product.id)),
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

const getUnitProduct = (
  crudGraphqlClient: GraphqlApiClient,
  productId: string,
): Observable<IUnitProduct> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitProductQuery>(
    CrudApi.getUnitProduct,
    { id: productId },
  ).pipe(
    map(product => product.getUnitProduct),
    switchMap(validateUnitProduct),
    catchError(err => {
      console.error(err);
      return throwError('Unit is missing');
    }),
  );
};
