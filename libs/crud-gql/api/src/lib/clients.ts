import {
  GraphqlApiClient,
  GraphqlApiFp,
} from '@bgap/shared/graphql/api-client';
import { CrudSdk, getSdkAmplify } from './sdk';

import awsmobile from './generated/aws-exports';
import { pipe } from 'fp-ts/lib/function';

const createSdk = (gqlClient: GraphqlApiClient) =>
  getSdkAmplify(gqlClient._client) as unknown as CrudSdk;

export const getCrudSdkForIAM = (
  awsAccesskeyId: string,
  awsSecretAccessKey: string,
) =>
  pipe(
    GraphqlApiFp.createBackendClient(
      awsmobile,
      awsAccesskeyId,
      awsSecretAccessKey,
    ),
    createSdk,
  );

export const getCrudSdkForUserPool = () =>
  pipe(GraphqlApiFp.createAuthenticatedClient(awsmobile, true), createSdk);

export const getCrudSdkPublic = () =>
  pipe(GraphqlApiFp.createPublicClient(awsmobile, true), createSdk);
