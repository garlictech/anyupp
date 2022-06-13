import { CrudSdk } from '@bgap/crud-gql/api';
import {
  GetUnitsNearLocationQueryVariables,
  MutationRegenerateUnitDataArgs,
} from '@bgap/domain';
import { getUnitsInRadius } from './get-units-in-radius.resolver';
import { regenerateUnitData } from './regenerate-unit-data.resolver';

export const unitRequestHandler = (crudSdk: CrudSdk) => ({
  getUnitsNearLocation: (requestPayload: GetUnitsNearLocationQueryVariables) =>
    getUnitsInRadius(requestPayload.input.location)(crudSdk),

  regenerateUnitData: (requestPayload: MutationRegenerateUnitDataArgs) =>
    regenerateUnitData(crudSdk)(requestPayload.input.id),
});
