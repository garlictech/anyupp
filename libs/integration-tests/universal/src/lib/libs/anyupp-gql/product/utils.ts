import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { CrudSdk } from 'libs/crud-gql/api/src';
import { ChainProduct, GroupProduct, UnitProduct } from '@bgap/domain';

export const getChainProduct = (sdk: CrudSdk, productId: string) => {
  return sdk.GetChainProduct({ id: productId }).pipe(
    throwIfEmptyValue<ChainProduct>(),
    catchError(err => {
      return throwError('ChainProdcuct is missing');
    }),
  );
};

export const getGroupProduct = (sdk: CrudSdk, productId: string) => {
  return sdk.GetGroupProduct({ id: productId }).pipe(
    throwIfEmptyValue<GroupProduct>(),
    catchError(err => {
      return throwError('GroupProdcuct is missing');
    }),
  );
};

export const getUnitProduct = (sdk: CrudSdk, productId: string) => {
  return sdk.GetUnitProduct({ id: productId }).pipe(
    throwIfEmptyValue<UnitProduct>(),
    catchError(err => {
      return throwError('UnitProdcuct is missing');
    }),
  );
};
