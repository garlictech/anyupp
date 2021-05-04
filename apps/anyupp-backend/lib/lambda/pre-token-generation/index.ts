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

  const desiredContext = event.request.userAttributes['custom:context'];

  console.error('***** desiredContext', desiredContext);

  const CrudApiClient = GraphqlApiFp.createBackendClient(
    awsConfig,
    // TODO use process.env variables
    'AKIAYIT7GMY5RXSLLQN3',
    //process.env.AWS_ACCESS_KEY_ID || '',
    'aYxNIqJ7O56ltpHb1Aq534bpv2r+Atpr1TUxiahx',
    //process.env.AWS_SECRET_ACCESS_KEY || '',
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
      i?.roleContext?.contextId?.toLowerCase() ===
      desiredContext?.toLowerCase(),
  );

  console.error('***** role', role);

  if (role?.roleContext) {
    // The given role has been assigned to the user
    const roleContent = fp.pick(
      ['role', 'chainId', 'groupId', 'unitId', 'contextId'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>role.roleContext, // TODO: remove this ANY
    );

    console.error('***** context OK', roleContent);

    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        ...roleContent,
      },
    };
  } else {
    console.error('***** context NOT ASSIGNED');

    // The user doesn't have an access to the given role
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        'custom:context': '',
      },
    };
  }

  callback(null, event);
};
