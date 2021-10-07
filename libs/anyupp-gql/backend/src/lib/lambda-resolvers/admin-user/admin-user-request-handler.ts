import { switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import { createAdminUser } from './create-admin-user.resolver';
import { deleteAdminUser } from './delete-admin-user.resolver';
import { AdminUserResolverDeps } from './utils';

// HANDLER
export const adminRequestHandler = (deps: AdminUserResolverDeps) => ({
  createAdminUser: (requestPayload: CrudApi.CreateAdminUserMutationVariables) =>
    createAdminUser(requestPayload)(deps).toPromise(),

  deleteAdminUser: (
    requestPayload: CrudApi.DeleteAdminUserMutationVariables,
  ) => {
    return deleteAdminUser(requestPayload)(deps).toPromise();
  },
});
