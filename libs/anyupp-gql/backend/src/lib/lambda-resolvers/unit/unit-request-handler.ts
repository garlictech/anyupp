import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

// HANDLER
export const unitRequestHandler = {
  getUnitsNearLocation: (crudGraphqlClient: GraphqlApiClient) => (
    requestPayload: AnyuppApi.GetUnitsNearLocationQueryVariables,
  ) => {
    return validatGetUnitsNearLocationInput(requestPayload)
      .pipe(
        switchMap(() =>
          getUnitsInRadius({
            crudGraphqlClient,
            location: requestPayload.input.location,
          }),
        ),
      )
      .toPromise();
  },
};

// INPUT VALIDATORS
// // GetUnitsInRadius
const getUnitsInRadiusInputSchema: Joi.SchemaMap<AnyuppApi.GetUnitsNearLocationInput> = {
  location: Joi.object(locationSchema).required(),
};
const getUnitsInRadiusQuerySchema: Joi.SchemaMap<AnyuppApi.GetUnitsNearLocationQueryVariables> = {
  input: Joi.object(getUnitsInRadiusInputSchema).required(),
};
const { validate: validatGetUnitsNearLocationInput } = validateSchema<
  AnyuppApi.GetUnitsNearLocationQueryVariables
>(getUnitsInRadiusQuerySchema, 'GetUnitsNearLocationQueryVariables');
