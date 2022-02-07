import * as CrudApi from '@bgap/crud-gql/api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';

export const getChainProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetChainProduct({ id: productId }).pipe(
    throwIfEmptyValue<CrudApi.ChainProduct>(),
    catchError(err => {
      return throwError('ChainProdcuct is missing');
    }),
  );
};

export const getGroupProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetGroupProduct({ id: productId }).pipe(
    throwIfEmptyValue<CrudApi.GroupProduct>(),
    catchError(err => {
      return throwError('GroupProdcuct is missing');
    }),
  );
};

export const getUnitProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetUnitProduct({ id: productId }).pipe(
    throwIfEmptyValue<CrudApi.UnitProduct>(),
    catchError(err => {
      return throwError('UnitProdcuct is missing');
    }),
  );
};
