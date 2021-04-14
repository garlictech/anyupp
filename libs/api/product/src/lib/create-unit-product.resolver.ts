import { Observable, of } from 'rxjs';

import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { AppsyncApi } from '@bgap/api/graphql/schema';

export const createUnitProduct = ({
  // userId,
  // cartId,
  amplifyGraphQlClient,
}: {
  // userId: string;
  // cartId: string;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<AppsyncApi.UnitProduct> => {
  // console.log(
  //   '### ~ file: order.service.ts ~ line 39 ~ INPUT PARAMS',
  //   JSON.stringify({
  //     userId,
  //     cartId,
  //   }),
  //   undefined,
  //   2,
  // );

  return of({} as any);
};

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
