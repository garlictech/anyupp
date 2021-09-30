import * as CrudApi from '@bgap/crud-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { regenerateUnitData } from './regenerate-unit-data.resolver';
import { UnitsResolverDeps } from './utils';

export const unitRequestHandler = (deps: UnitsResolverDeps) => ({
  getUnitsNearLocation: (
    requestPayload: CrudApi.GetUnitsNearLocationQueryVariables,
  ) =>
    validatGetUnitsNearLocationInput(requestPayload)
      .pipe(
        switchMap(() => getUnitsInRadius(requestPayload.input.location)(deps)),
      )
      .toPromise(),

  regenerateUnitData: (
    requestPayload: CrudApi.MutationRegenerateUnitDataArgs,
  ) =>
    // TODO: validate input
    // return validatGetUnitsNearLocationInput(requestPayload)
    //   .pipe(
    //     switchMap(() =>

    regenerateUnitData(deps)(requestPayload.input.id).toPromise(),
});

const getUnitsInRadiusInputSchema: Joi.SchemaMap<CrudApi.GetUnitsNearLocationInput> =
  {
    location: Joi.object(locationSchema).required(),
  };

const getUnitsInRadiusQuerySchema: Joi.SchemaMap<CrudApi.GetUnitsNearLocationQueryVariables> =
  {
    input: Joi.object(getUnitsInRadiusInputSchema).required(),
  };

const { validate: validatGetUnitsNearLocationInput } =
  validateSchema<CrudApi.GetUnitsNearLocationQueryVariables>(
    getUnitsInRadiusQuerySchema,
    'GetUnitsNearLocationQueryVariables',
  );
