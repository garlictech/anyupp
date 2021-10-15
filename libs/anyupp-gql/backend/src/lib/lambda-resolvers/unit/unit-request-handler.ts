import * as CrudApi from '@bgap/crud-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import * as Joi from 'joi';
import { switchMap, tap } from 'rxjs/operators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { regenerateUnitData } from './regenerate-unit-data.resolver';
import { UnitsResolverDeps } from './utils';

const getUnitsInRadiusInputSchema: Joi.SchemaMap<CrudApi.GetUnitsNearLocationInput> =
  {
    location: Joi.object(locationSchema).required(),
  };

const getUnitsInRadiusQuerySchema: Joi.SchemaMap<CrudApi.GetUnitsNearLocationQueryVariables> =
  {
    input: Joi.object(getUnitsInRadiusInputSchema).required(),
  };

const { validate: validateGetUnitsNearLocationInput } =
  validateSchema<CrudApi.GetUnitsNearLocationQueryVariables>(
    getUnitsInRadiusQuerySchema,
    'GetUnitsNearLocationQueryVariables',
  );

export const unitRequestHandler = (crudSdk: CrudApi.CrudSdk) => ({
  getUnitsNearLocation: (
    requestPayload: CrudApi.GetUnitsNearLocationQueryVariables,
  ) => {
    return validateGetUnitsNearLocationInput(requestPayload).pipe(
      switchMap(() => getUnitsInRadius(requestPayload.input.location)(crudSdk)),
    );
  },

  regenerateUnitData: (
    requestPayload: CrudApi.MutationRegenerateUnitDataArgs,
  ) => regenerateUnitData(crudSdk)(requestPayload.input.id),
});
