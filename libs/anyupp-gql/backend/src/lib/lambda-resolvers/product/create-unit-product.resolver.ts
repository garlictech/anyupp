import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import {
  executeMutation,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IUnitProduct } from '@bgap/shared/types';

export const createUnitProduct = ({
  input,
  crudGraphqlClient,
}: {
  input: AnyuppApi.CreateUnitProductInput;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<IUnitProduct> => {
  return createUnitProductInDb({ input, crudGraphqlClient });
};

const createUnitProductInDb = ({
  input,
  crudGraphqlClient,
}: {
  input: CrudApi.CreateUnitProductInput;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<IUnitProduct> => {
  return executeMutation(crudGraphqlClient)<CrudApi.CreateUnitProductMutation>(
    CrudApiMutationDocuments.createUnitProduct,
    {
      input,
    },
  ).pipe(
    map(x => x.createUnitProduct),
    switchMap(validateUnitProduct),
    catchError(err => {
      console.error(err);
      return throwError('Internal Unit Product creation error');
    }),
  );
};
