import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestProductComponentSet = (
  input: CrudApi.CreateProductComponentSetInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateProductComponentSet({ input })
    .pipe(resultTap('PRODUCT_COMPONENT_SET create', input.id!));

export const deleteTestProductComponentSet = (
  id: string,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .DeleteProductComponentSet({ input: { id } })
    .pipe(resultTap('PRODUCT_COMPONENT_SET delete', id));

export const createTestProductComponent = (
  input: CrudApi.CreateProductComponentInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateProductComponent({ input })
    .pipe(resultTap('PRODUCT_COMPONENT create', input.id!));

export const deleteTestProductComponent = (
  id: string,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .DeleteProductComponent({ input: { id } })
    .pipe(resultTap('PRODUCT_COMPONENT delete', id));
