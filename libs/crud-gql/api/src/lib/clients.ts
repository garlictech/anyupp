import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { getSdkAmplify } from './sdk';

import awsmobile from './generated/aws-exports';

export const getCrudSdkForIAM = (
  awsAccesskeyId: string,
  awsSecretAccessKey: string,
) => {
  const x = GraphqlApiFp.createBackendClient(
    awsmobile,
    awsAccesskeyId,
    awsSecretAccessKey,
  );
  const awsClient = x._client;
  return getSdkAmplify(awsClient);
};
