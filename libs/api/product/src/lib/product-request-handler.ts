import { AppsyncApi } from '@bgap/api/graphql/schema';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

import { createUnitProduct } from './create-unit-product.resolver';

// interface WithAuthenticatedUser {
//   userId: string;
// }
export type CreateUnitProductRequest /* WithAuthenticatedUser & */ = AppsyncApi.MutationCreateUnitProductArgs;

export const productRequestHandler = {
  createUnitProduct: (amplifyGraphQlClient: GraphqlApiClient) => (
    requestPayload: CreateUnitProductRequest,
  ) => {
    // missingParametersCheck<CreateUnitProductRequest>(requestPayload, [
    //   'userId',
    //   'input',
    // ]);
    // missingParametersCheck<AppsyncApi.CreateUnitProductInput>(
    //   requestPayload.input,
    //   ['id'],
    // );

    return createUnitProduct({
      // userId: requestPayload.userId,
      // cartId: requestPayload.input.id,
      input: requestPayload.input,
      amplifyGraphQlClient,
    }).toPromise();
  },
};
