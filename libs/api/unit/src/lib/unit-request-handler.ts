import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';

import { AppsyncApi } from '@bgap/api/graphql/schema';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

// HANDLER
export const unitRequestHandler = {
  getUnitsNearLocation: (amplifyGraphQlClient: GraphqlApiClient) => (
    requestPayload: AppsyncApi.GetUnitsNearLocationQueryVariables,
  ) => {
    return validatGetUnitsNearLocationInput(requestPayload)
      .pipe(
        switchMap(() =>
          getUnitsInRadius({
            amplifyGraphQlClient,
            location: requestPayload.input.location,
          }),
        ),
      )
      .toPromise();
  },
};

// INPUT VALIDATORS
// // GetUnitsInRadius
const getUnitsInRadiusInputSchema: Joi.SchemaMap<AppsyncApi.GetUnitsNearLocationInput> = {
  location: Joi.object(locationSchema).required(),
};
const getUnitsInRadiusQuerySchema: Joi.SchemaMap<AppsyncApi.GetUnitsNearLocationQueryVariables> = {
  input: Joi.object(getUnitsInRadiusInputSchema).required(),
};
const { validate: validatGetUnitsNearLocationInput } = validateSchema<
  AppsyncApi.GetUnitsNearLocationQueryVariables
>(getUnitsInRadiusQuerySchema, 'GetUnitsNearLocationQueryVariables');
