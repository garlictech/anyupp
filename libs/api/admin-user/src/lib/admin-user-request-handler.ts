import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';

import { AppsyncApi } from '@bgap/api/graphql/schema';
import { validateSchema } from '@bgap/shared/types';

import { createAdminUser } from './create-admin-user.resolver';
import { deleteAdminUser } from './delete-admin-user.resolver';

// HANDLER
export const adminRequestHandler = {
  createAdminUser: (
    requestPayload: AppsyncApi.CreateAdminUserMutationVariables,
  ) => {
    return validatCreateAdminUserInput(requestPayload)
      .pipe(switchMap(() => createAdminUser(requestPayload)))
      .toPromise();
  },

  deleteAdminUser: (
    requestPayload: AppsyncApi.DeleteAdminUserMutationVariables,
  ) => {
    return validatDeleteAdminuserInput(requestPayload)
      .pipe(switchMap(() => deleteAdminUser(requestPayload)))
      .toPromise();
  },
};

// INPUT VALIDATORS
// CREATE
const createAdminUserInputSchema: Joi.SchemaMap<AppsyncApi.CreateAdminUserInput> = {
  email: Joi.string().required(),
  phone: Joi.string().required(),
  name: Joi.string().required(),
};
const createMutationSchema: Joi.SchemaMap<AppsyncApi.CreateAdminUserMutationVariables> = {
  input: Joi.object(createAdminUserInputSchema).required(),
};
const { validate: validatCreateAdminUserInput } = validateSchema<
  AppsyncApi.CreateAdminUserMutationVariables
>(createMutationSchema, 'CreateAdminUserMutationVariables');

// DELETE
const deleteInputSchema: Joi.SchemaMap<AppsyncApi.DeleteAdminUserMutationVariables> = {
  userName: Joi.string().required(),
};
const { validate: validatDeleteAdminuserInput } = validateSchema<
  AppsyncApi.DeleteAdminUserMutationVariables
>(deleteInputSchema, 'DeleteAdminUserMutationVariables');
