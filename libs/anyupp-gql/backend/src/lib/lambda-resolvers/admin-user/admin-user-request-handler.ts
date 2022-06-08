import {
  CreateAdminUserMutationVariables,
  DeleteAdminUserMutationVariables,
} from '@bgap/domain';

import { createAdminUser } from './create-admin-user.resolver';
import { deleteAdminUser } from './delete-admin-user.resolver';
import { AdminUserResolverDeps } from './utils';

// HANDLER
export const adminRequestHandler = (deps: AdminUserResolverDeps) => ({
  createAdminUser: (requestPayload: CreateAdminUserMutationVariables) =>
    createAdminUser(requestPayload)(deps).toPromise(),

  deleteAdminUser: (requestPayload: DeleteAdminUserMutationVariables) => {
    return deleteAdminUser(requestPayload)(deps).toPromise();
  },
});
