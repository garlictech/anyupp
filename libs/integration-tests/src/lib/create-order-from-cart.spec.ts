import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { awsConfig } from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/graphql/schema';
import { CONFIG } from '@bgap/shared/config';
import { executeMutation, GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { IAmplifyApiConfig } from '@bgap/shared/types';

export const AWS_APPSYNC_CONFIG: IAmplifyApiConfig = {
  api_key: CONFIG.GraphqlApiKey,
  aws_appsync_graphqlEndpoint: CONFIG.GraphqlApiUrl,
  aws_appsync_region: awsConfig.aws_appsync_region,
  aws_user_pools_id: awsConfig.aws_user_pools_id,
  aws_user_pools_web_client_id: awsConfig.aws_user_pools_web_client_id,
  // ...awsConfig,
};

export const appsyncGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_APPSYNC_CONFIG,
  console,
  true,
);

describe('CreatCartFromOrder mutation test', () => {
  it('should fail without a cart', done => {
    executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateOrderFromCartMutationMutation
    >(AppsyncApi.CreateOrderFromCartMutation, { id: 'NOT_EXISTING_CART' }).pipe(
      catchError(error => {
        expect(error).toMatchInlineSnapshot();
        done();
        return of(true);
      }),
    );

    // appsyncGraphQlClient.mutate()
  });
});
