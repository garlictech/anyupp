import { createAnonymUser } from './create-anonym-user.resolver';
import { UserResolverDeps } from './utils';

// HANDLER
export const userRequestHandler = (deps: UserResolverDeps) => ({
  createAnonymUser: () => createAnonymUser(deps).toPromise(),
});
