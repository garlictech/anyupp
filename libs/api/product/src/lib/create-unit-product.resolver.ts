import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
} from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/graphql/schema';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import {
  executeMutation,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IProduct } from '@bgap/shared/types';

export const createUnitProduct = ({
  input,
  amplifyGraphQlClient,
}: {
  input: AppsyncApi.CreateUnitProductInput;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<IProduct> => {
  return createUnitProductInDb({ input, amplifyGraphQlClient });
};

const createUnitProductInDb = ({
  input,
  amplifyGraphQlClient,
}: {
  input: AmplifyApi.CreateUnitProductInput;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<IProduct> => {
  return executeMutation(amplifyGraphQlClient)<
    AmplifyApi.CreateUnitProductMutation
  >(AmplifyApiMutationDocuments.createUnitProduct, {
    input,
  }).pipe(
    map(x => x.createUnitProduct),
    switchMap(validateUnitProduct),
    catchError(err => {
      console.error(err);
      return throwError('Internal Unit Product creation error');
    }),
  );
};
