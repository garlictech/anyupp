import { PreTokenGenerationTriggerHandler } from 'aws-lambda';

export const handler: PreTokenGenerationTriggerHandler = async event => {
  const desiredContext = event.request.userAttributes['custom:context'];

  // add the context checking logic here. The user id is: event.request.userAttributes.sub
  // verify the role with graphql, if it is OK, then fetch teh context data, and
  // execute code like below
  // otherwise do NOT execute it so that there is no context data in the token.

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      groupId: 'MY GROUP ID',
    },
  };

  return event;
};
