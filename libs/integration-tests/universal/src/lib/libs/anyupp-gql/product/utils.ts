import * as CrudApi from '@bgap/crud-gql/api';
import {
  validateChainProduct,
  validateGroupProduct,
  validateUnitProduct,
} from '@bgap/shared/data-validators';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const getChainProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetChainProduct({ id: productId }).pipe(
    switchMap(validateChainProduct),
    catchError(err => {
      console.error(err);
      return throwError('ChainProdcuct is missing');
    }),
  );
};

export const getGroupProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetGroupProduct({ id: productId }).pipe(
    switchMap(validateGroupProduct),
    catchError(err => {
      console.error(err);
      return throwError('GroupProdcuct is missing');
    }),
  );
};

export const getUnitProduct = (sdk: CrudApi.CrudSdk, productId: string) => {
  return sdk.GetUnitProduct({ id: productId }).pipe(
    switchMap(validateUnitProduct),
    catchError(err => {
      console.error(err);
      return throwError('UnitProdcuct is missing');
    }),
  );
};
