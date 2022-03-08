import * as CrudApi from '@bgap/crud-gql/api';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { regenerateUnitData } from './regenerate-unit-data.resolver';

export const unitRequestHandler = (crudSdk: CrudApi.CrudSdk) => ({
  getUnitsNearLocation: (
    requestPayload: CrudApi.GetUnitsNearLocationQueryVariables,
  ) => getUnitsInRadius(requestPayload.input.location)(crudSdk),

  regenerateUnitData: (
    requestPayload: CrudApi.MutationRegenerateUnitDataArgs,
  ) => regenerateUnitData(crudSdk)(requestPayload.input.id),
});
