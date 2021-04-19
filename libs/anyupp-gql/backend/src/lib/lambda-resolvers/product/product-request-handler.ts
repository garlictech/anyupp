import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

import { createUnitProduct } from './create-unit-product.resolver';

// interface WithAuthenticatedUser {
//   userId: string;
// }
export type CreateUnitProductRequest /* WithAuthenticatedUser & */ = AnyuppApi.MutationCreateUnitProductArgs;

export const productRequestHandler = {
  createUnitProduct: (crudGraphqlClient: GraphqlApiClient) => (
    requestPayload: CreateUnitProductRequest,
  ) => {
    // missingParametersCheck<CreateUnitProductRequest>(requestPayload, [
    //   'userId',
    //   'input',
    // ]);
    // missingParametersCheck<AnyuppApi.CreateUnitProductInput>(
    //   requestPayload.input,
    //   ['id'],
    // );

    return createUnitProduct({
      // userId: requestPayload.userId,
      // cartId: requestPayload.input.id,
      input: requestPayload.input,
      crudGraphqlClient,
    }).toPromise();
  },
};
