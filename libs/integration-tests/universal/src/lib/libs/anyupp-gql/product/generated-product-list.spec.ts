import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
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

describe('GenerateProductList tests', () => {
  describe('generateProductListForAUnit function', () => {});
  it('should generate all the products in the db', done => {
    generateProductListForAUnit({});
  }, 15000);
});
