import * as AnyuppApi from '@bgap/anyupp-gql/api';
import {
  createUnitProductSchema,
  unitProductSchema,
  updateChainProductSchema,
  updateGroupProductSchema,
  updateUnitProductSchema,
  validateSchema,
} from '@bgap/shared/data-validators';
import Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import { updateChainProduct } from './chain-product.resolver';
import { updateGroupProduct } from './group-product.resolver';
import {
  createUnitProduct,
  deleteUnitProduct,
  updateUnitProduct,
} from './unit-product.resolver';
import { ProductResolverDeps } from './utils';

// VALIDATORS
// CHAIN PRODUCT
const { validate: validateUpdateChainProductRequest } =
  validateSchema<AnyuppApi.UpdateChainProductMutationVariables>(
    {
      input: updateChainProductSchema.required(),
    },
    'UpdateChainProductMutationVariables',
  );

// GROUP PRODUCT
const { validate: validateUpdateGroupProductRequest } =
  validateSchema<AnyuppApi.UpdateGroupProductMutationVariables>(
    {
      input: updateGroupProductSchema.required(),
    },
    'UpdateGroupProductMutationVariables',
  );

// UNIT PRODUCT
const { validate: validateCreateUnitProductRequest } =
  validateSchema<AnyuppApi.CreateUnitProductMutationVariables>(
    {
      input: Joi.object(createUnitProductSchema).required(),
    },
    'CreateUnitProductMutationVariables',
  );
const { validate: validateUpdateUnitProductRequest } =
  validateSchema<AnyuppApi.UpdateUnitProductMutationVariables>(
    {
      input: updateUnitProductSchema.required(),
    },
    'UpdateUnitProductMutationVariables',
  );
const { validate: validateDeleteUnitProductRequest } =
  validateSchema<AnyuppApi.DeleteUnitProductMutationVariables>(
    { id: unitProductSchema.id },
    'DeleteUnitProductMutationVariables',
  );

// HANDLER
export const productRequestHandler = (deps: ProductResolverDeps) => ({
  // CHAIN PRODUCT
  updateChainProduct: (
    requestPayload: AnyuppApi.UpdateChainProductMutationVariables,
  ) =>
    validateUpdateChainProductRequest(requestPayload)
      .pipe(switchMap(() => updateChainProduct(deps)(requestPayload.input)))
      .toPromise(),
  // GROUP PRODUCT
  updateGroupProduct: (
    requestPayload: AnyuppApi.UpdateGroupProductMutationVariables,
  ) =>
    validateUpdateGroupProductRequest(requestPayload)
      .pipe(switchMap(() => updateGroupProduct(deps)(requestPayload.input)))
      .toPromise(),
  // UNIT PRODUCT
  createUnitProduct: (
    requestPayload: AnyuppApi.CreateUnitProductMutationVariables,
  ) =>
    validateCreateUnitProductRequest(requestPayload)
      .pipe(switchMap(() => createUnitProduct(deps)(requestPayload.input)))
      .toPromise(),
  updateUnitProduct: (
    requestPayload: AnyuppApi.UpdateUnitProductMutationVariables,
  ) =>
    validateUpdateUnitProductRequest(requestPayload)
      .pipe(switchMap(() => updateUnitProduct(deps)(requestPayload.input)))
      .toPromise(),
  deleteUnitProduct: (
    requestPayload: AnyuppApi.DeleteUnitProductMutationVariables,
  ) =>
    validateDeleteUnitProductRequest(requestPayload)
      .pipe(switchMap(() => deleteUnitProduct(deps)(requestPayload.id)))
      .toPromise(),
});
