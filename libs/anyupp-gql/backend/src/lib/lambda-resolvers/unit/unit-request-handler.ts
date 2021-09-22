import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { regenerateUnitData } from './regenerate-unit-data.resolver';
import { UnitsResolverDeps } from './utils';

export const unitRequestHandler = (deps: UnitsResolverDeps) => ({
  getUnitsNearLocation: (
    requestPayload: AnyuppApi.GetUnitsNearLocationQueryVariables,
  ) =>
    validatGetUnitsNearLocationInput(requestPayload)
      .pipe(
        switchMap(() => getUnitsInRadius(requestPayload.input.location)(deps)),
      )
      .toPromise(),

  regenerateUnitData: (
    requestPayload: AnyuppApi.MutationRegenerateUnitDataArgs,
  ) =>
    // TODO: validate input
    // return validatGetUnitsNearLocationInput(requestPayload)
    //   .pipe(
    //     switchMap(() =>

    regenerateUnitData(deps)(requestPayload.input.id).toPromise(),
});

const getUnitsInRadiusInputSchema: Joi.SchemaMap<AnyuppApi.GetUnitsNearLocationInput> =
  {
    location: Joi.object(locationSchema).required(),
  };

const getUnitsInRadiusQuerySchema: Joi.SchemaMap<AnyuppApi.GetUnitsNearLocationQueryVariables> =
  {
    input: Joi.object(getUnitsInRadiusInputSchema).required(),
  };

const { validate: validatGetUnitsNearLocationInput } =
  validateSchema<AnyuppApi.GetUnitsNearLocationQueryVariables>(
    getUnitsInRadiusQuerySchema,
    'GetUnitsNearLocationQueryVariables',
  );
