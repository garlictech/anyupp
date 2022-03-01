import { PreTokenGenerationTriggerHandler } from 'aws-lambda';
import Amplify from '@aws-amplify/core';
import { awsConfig, getCrudSdkForIAM } from '@bgap/crud-gql/api';

export const handler: PreTokenGenerationTriggerHandler = async (
  event,
  _context,
  callback,
) => {
  Amplify.configure(awsConfig);
  //const desiredContext = event.request.userAttributes['custom:context'];

  console.debug('EVENT:', event);

  const sdk = getCrudSdkForIAM(
    process.env.API_ACCESS_KEY_ID || '',
    process.env.API_SECRET_ACCESS_KEY || '',
  );

  const adminUser = await sdk
    .GetAdminUser({
      id: event.userName,
    })
    .toPromise();

  console.debug(':USER', adminUser);
  //
  // Find the role
  /*const role = (adminUser?.roleContexts?.items || []).find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i: any) =>
      i?.roleContext?.contextId?.toLowerCase() ===
      desiredContext?.toLowerCase(),
  );
*/
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      contextId: 'SU_CTX_ID',
      role: 'superuser',
    },
  };
  /*if (role?.roleContext) {
    // The given role has been assigned to the user
        const roleContent = pipe(
      role.roleContext,
      fp.pick(['role', 'chainId', 'groupId', 'unitId', 'contextId']),
      fp.pickBy(fp.negate(fp.isUndefined)),
    );
    const roleContent = {
      contextId: 'SU_CTX_ID',
      role: 'superuser',
    };

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
  }*/

  callback(null, event);
};
