import * as CrudApi from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '@bgap/shared/utils';

export const getOrder = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk
    .GetOrder({ id }, { fetchPolicy: 'no-cache' })
    .pipe(throwIfEmptyValue<CrudApi.Order>());
};
