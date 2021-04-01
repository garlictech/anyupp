import { PreAuthenticationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoISP = new CognitoIdentityServiceProvider();

export const handler: PreAuthenticationTriggerHandler = async event => {
  console.log('*****', event, JSON.stringify(event, null, 2));
  //event.response.claimsOverrideDetails = {
  //  claimsToAddOrOverride: {
  //    roles: (roles && roles.Value) || 'user',
  //  },
  //};

  return {
    ...event,
    callerContext: { adminContext: 'foobar' },
  };
};
