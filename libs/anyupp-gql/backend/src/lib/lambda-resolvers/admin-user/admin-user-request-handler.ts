import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import { createAdminUser } from './create-admin-user.resolver';
import { deleteAdminUser } from './delete-admin-user.resolver';
import { AdminUserResolverDeps } from './utils';

// HANDLER
export const adminRequestHandler = (deps: AdminUserResolverDeps) => ({
  createAdminUser: (
    requestPayload: CrudApi.CreateAdminUserMutationVariables,
  ) => {
    return validatCreateAdminUserInput(requestPayload)
      .pipe(switchMap(() => createAdminUser(requestPayload)(deps)))
      .toPromise();
  },

  deleteAdminUser: (
    requestPayload: CrudApi.DeleteAdminUserMutationVariables,
  ) => {
    return deleteAdminUser(requestPayload)(deps);
  },
});

// INPUT VALIDATORS
// CREATE
const createAdminUserInputSchema: Joi.SchemaMap<CrudApi.CreateAdminUserInput> =
  {
    email: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
  };
const createMutationSchema: Joi.SchemaMap<CrudApi.CreateAdminUserMutationVariables> =
  {
    input: Joi.object(createAdminUserInputSchema).required(),
  };
const { validate: validatCreateAdminUserInput } =
  validateSchema<CrudApi.CreateAdminUserMutationVariables>(
    createMutationSchema,
    'CreateAdminUserMutationVariables',
  );
