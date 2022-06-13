import { CrudSdk } from '@bgap/crud-gql/api';
import {
  CreateProductComponentInput,
  CreateProductComponentSetInput,
} from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestProductComponentSet = (
  input: CreateProductComponentSetInput,
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateProductComponentSet({ input })
    .pipe(resultTap('PRODUCT_COMPONENT_SET create', input.id!));

export const deleteTestProductComponentSet = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteProductComponentSet({ input: { id } })
    .pipe(resultTap('PRODUCT_COMPONENT_SET delete', id));

export const createTestProductComponent = (
  input: CreateProductComponentInput,
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateProductComponent({ input })
    .pipe(resultTap('PRODUCT_COMPONENT create', input.id!));

export const deleteTestProductComponent = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteProductComponent({ input: { id } })
    .pipe(resultTap('PRODUCT_COMPONENT delete', id));
