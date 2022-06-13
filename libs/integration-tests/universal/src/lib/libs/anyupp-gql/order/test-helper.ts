import { throwIfEmptyValue } from '@bgap/shared/utils';
import { CrudSdk } from '@bgap/crud-gql/api';
import { Order } from '@bgap/domain';

export const getOrder = (crudSdk: CrudSdk, id: string) => {
  return crudSdk
    .GetOrder({ id }, { fetchPolicy: 'no-cache' })
    .pipe(throwIfEmptyValue<Order>());
};
