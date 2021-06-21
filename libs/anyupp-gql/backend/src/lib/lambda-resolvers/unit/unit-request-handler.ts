import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { UnitsResolverDeps } from './utils';
import { regenerateUnitData } from './regenerate-unit-data.resolver';

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

    regenerateUnitData(requestPayload.input.id)(deps).toPromise(),
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
