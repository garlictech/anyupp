import { PreTokenGenerationTriggerHandler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { map } from 'rxjs/operators';

import Amplify from '@aws-amplify/core';
import { CrudApi, CrudApiQueryDocuments, awsConfig } from '@bgap/crud-gql/api';
import { executeQuery, GraphqlApiFp } from '@bgap/shared/graphql/api-client';

export const handler: PreTokenGenerationTriggerHandler = async (
  event,
  context,
  callback,
) => {
  Amplify.configure(awsConfig);

  console.error('***** event', event);
  // console.error('***** process.env.AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
  // console.error('***** process.env.AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);

  const desiredContext = event.request.userAttributes['custom:context'];


  const CrudApiClient = GraphqlApiFp.createBackendClient(
    awsConfig,
    // 'AKIAYIT7GMY5RXSLLQN3',
    process.env.AWS_ACCESS_KEY_ID || '',
    // 'aYxNIqJ7O56ltpHb1Aq534bpv2r+Atpr1TUxiahx',
    process.env.AWS_SECRET_ACCESS_KEY || '',
    console,
  );

  const adminUser = await executeQuery(CrudApiClient)<
    CrudApi.GetAdminUserQuery
  >(CrudApiQueryDocuments.getAdminUser, {
    id: event.request.userAttributes.sub,
  })
    .pipe(map(result => result.getAdminUser))
    .toPromise();

  // Find the role
  const role = (adminUser?.roleContexts?.items || []).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i: any) =>
      i?.roleContext?.contextId?.toLowerCase() === desiredContext.toLowerCase(),
  );

  if (role?.roleContext) {
    // The given role has been assigned to the user
    const roleContent = fp.pick(
      ['role', 'chainId', 'groupId', 'unitId'],
      <any>role.roleContext,
    );

    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        ...roleContent,
      },
    };
  } else {
    // The user doesn't have an access to the given role
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        'custom:context': '',
      },
    };
  }

  callback(null, event);
};
