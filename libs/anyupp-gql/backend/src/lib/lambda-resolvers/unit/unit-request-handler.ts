import * as Joi from 'joi';
import { switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { locationSchema, validateSchema } from '@bgap/shared/data-validators';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { regenerateUnitData } from './regenerate-unit-data.resolver';

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
  regenerateUnitData: (crudGraphqlClient: GraphqlApiClient) => (
    requestPayload: AnyuppApi.MutationRegenerateUnitDataArgs,
  ) => {
    // return validatGetUnitsNearLocationInput(requestPayload)
    //   .pipe(
    //     switchMap(() =>
    return (
      regenerateUnitData({
        crudGraphqlClient,
        unitId: requestPayload.input.id,
      })
        //   ),
        // )
        .toPromise()
    );
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
