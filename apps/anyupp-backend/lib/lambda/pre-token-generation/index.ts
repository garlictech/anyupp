import { PreTokenGenerationTriggerHandler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import Amplify from '@aws-amplify/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { awsConfig } from '@bgap/crud-gql/api';
import { executeQuery, GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { pipe } from 'fp-ts/lib/function';

export const handler: PreTokenGenerationTriggerHandler = async (
  event,
  context,
  callback,
) => {
  Amplify.configure(awsConfig);
  const desiredContext = event.request.userAttributes['custom:context'];

  const crudApiClient = GraphqlApiFp.createBackendClient(
    awsConfig,
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
    console,
  );

  const adminUser = await executeQuery<
    CrudApi.QueryGetAdminUserArgs,
    CrudApi.AdminUser
  >(CrudApi.getAdminUser, 'getAdminUser', {
    id: event.request.userAttributes.sub,
  })(crudApiClient).toPromise();

  // Find the role
  const role = (adminUser?.roleContexts?.items || []).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i: any) =>
      i?.roleContext?.contextId?.toLowerCase() ===
      desiredContext?.toLowerCase(),
  );

  if (role?.roleContext) {
    // The given role has been assigned to the user
    const roleContent = pipe(
      role.roleContext,
      fp.pick(['role', 'chainId', 'groupId', 'unitId', 'contextId']),
      fp.pickBy(fp.negate(fp.isUndefined)),
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
