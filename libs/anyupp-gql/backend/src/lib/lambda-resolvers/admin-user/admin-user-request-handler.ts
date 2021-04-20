import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';

import { createAdminUser } from './create-admin-user.resolver';
import { deleteAdminUser } from './delete-admin-user.resolver';

// HANDLER
export const adminRequestHandler = {
  createAdminUser: (
    requestPayload: AnyuppApi.CreateAdminUserMutationVariables,
  ) => {
    return validatCreateAdminUserInput(requestPayload)
      .pipe(switchMap(() => createAdminUser(requestPayload)))
      .toPromise();
  },

  deleteAdminUser: (
    requestPayload: AnyuppApi.DeleteAdminUserMutationVariables,
  ) => {
    return validatDeleteAdminuserInput(requestPayload)
      .pipe(switchMap(() => deleteAdminUser(requestPayload)))
      .toPromise();
  },
};

// INPUT VALIDATORS
// CREATE
const createAdminUserInputSchema: Joi.SchemaMap<AnyuppApi.CreateAdminUserInput> = {
  email: Joi.string().required(),
  phone: Joi.string().required(),
  name: Joi.string().required(),
};
const createMutationSchema: Joi.SchemaMap<AnyuppApi.CreateAdminUserMutationVariables> = {
  input: Joi.object(createAdminUserInputSchema).required(),
};
const { validate: validatCreateAdminUserInput } = validateSchema<
  AnyuppApi.CreateAdminUserMutationVariables
>(createMutationSchema, 'CreateAdminUserMutationVariables');

// DELETE
const deleteInputSchema: Joi.SchemaMap<AnyuppApi.DeleteAdminUserMutationVariables> = {
  userName: Joi.string().required(),
};
const { validate: validatDeleteAdminuserInput } = validateSchema<
  AnyuppApi.DeleteAdminUserMutationVariables
>(deleteInputSchema, 'DeleteAdminUserMutationVariables');
