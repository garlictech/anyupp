import { PreTokenGenerationTriggerHandler } from 'aws-lambda';

export const handler: PreTokenGenerationTriggerHandler = async event => {
  // the context that the user wants to authorize
  const paramName = 'custom:context';
  const desiredContext = event.request.userAttributes[paramName];
  console.log('****', event);

  // add the context checking logic here. The user id is: event.request.userAttributes.sub
  // verify the role with graphql, if it is OK, then fetch teh context data, and
  // execute code like below
  // otherwise do NOT execute it so that there is no context data in the token.

  // This line simulates a context forbidden
  if (desiredContext === 'BAD_CONTEXT') {
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        'custom:context': '',
      },
    };
  } else {
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        groupId: 'MY GROUP ID',
      },
    };
  }

  return event;
};
