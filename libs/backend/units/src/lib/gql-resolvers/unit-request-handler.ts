import { CrudSdk } from '@bgap/crud-gql/api';
import { GetUnitsNearLocationQueryVariables } from '@bgap/domain';
import { getUnitsInRadius } from './get-units-in-radius.resolver';

export const unitRequestHandler = (crudSdk: CrudSdk) => ({
  getUnitsNearLocation: (requestPayload: GetUnitsNearLocationQueryVariables) =>
    getUnitsInRadius(requestPayload.input.location)(crudSdk),
});
