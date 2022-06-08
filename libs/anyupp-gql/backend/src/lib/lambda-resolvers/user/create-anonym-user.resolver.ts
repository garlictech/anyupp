import { Observable } from 'rxjs';
import { v1 as uuidV1 } from 'uuid';

import { CreateAnonymUserOutput } from '@bgap/domain';

import { createConfirmedUserInCognito, UserResolverDeps } from './utils';

export const createAnonymUser = (
  deps: UserResolverDeps,
): Observable<CreateAnonymUserOutput> => {
  const generatedId = uuidV1();
  const email = `anonymuser+${generatedId}@anyupp.com`;
  const password = uuidV1() + 'UPPERCASE';

  return createConfirmedUserInCognito({
    cognitoidentityserviceprovider: deps.cognitoidentityserviceprovider,
    userPoolId: deps.consumerUserPoolId,
  })({
    email,
    password,
    name: 'AnonymUser',
  });
};
