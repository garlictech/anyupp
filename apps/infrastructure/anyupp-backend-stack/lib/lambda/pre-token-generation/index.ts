import { PreTokenGenerationTriggerHandler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { map } from 'rxjs/operators';

import Amplify from '@aws-amplify/core';
import {
  AmplifyApi,
  AmplifyApiQueryDocuments,
  awsConfig,
} from '@bgap/admin/amplify-api';
import { executeQuery, GraphqlApiFp } from '@bgap/shared/graphql/api-client';

export const handler: PreTokenGenerationTriggerHandler = async (
  event,
  context,
  callback,
) => {
  Amplify.configure(awsConfig);

  const desiredContext = event.request.userAttributes['custom:context'];
  const amplifyApiClient = GraphqlApiFp.createBackendClient(
    awsConfig,
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
    console,
  );

  const adminUser = await executeQuery(amplifyApiClient)<
    AmplifyApi.GetAdminUserQuery
  >(AmplifyApiQueryDocuments.getAdminUser, {
    id: event.request.userAttributes.sub,
  })
    .pipe(map(result => result.getAdminUser))
    .toPromise();

  // Find the role
  const role = (adminUser?.roleContexts?.items || []).find(
    i =>
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
