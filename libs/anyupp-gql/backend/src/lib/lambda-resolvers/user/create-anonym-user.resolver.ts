import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { v1 as uuidV1 } from 'uuid';

import * as AnyuppApi from '@bgap/anyupp-gql/api';

import { createConfirmedUserInCognito, UserResolverDeps } from './utils';

export const createAnonymUser = (
  deps: UserResolverDeps,
): Observable<AnyuppApi.CreateAnonymUserOutput> => {
  const generatedId = uuidV1();
  const email = `${generatedId}@${generatedId}.hu`;
  const password = uuidV1() + 'UPPERCASE';

  return createConfirmedUserInCognito(deps)({
    email,
    password,
    name: 'AnonymUser',
  }).pipe(
    mapTo({
      email,
      pwd: password,
    }),
  );
};
