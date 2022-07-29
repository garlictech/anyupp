import { pipe } from 'fp-ts/lib/function';

import { Observable } from 'rxjs';
import * as R from 'ramda';
import { shareReplay } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { AxiosStatic } from 'axios';
import { DynamoDB } from 'aws-sdk';
import { CrudSdk } from '@bgap/crud-gql/api';
import { UnitProduct } from '@bgap/domain';

import { OrderPolicy, Unit } from '@bgap/domain';

export const hasSimplifiedOrder = (unit: Unit): boolean =>
  !R.isNil(unit.orderPolicy) && unit.orderPolicy !== OrderPolicy.full;

export interface OrderResolverDeps {
  crudSdk: CrudSdk;
  orderTableName: string;
  unitTableName: string;
  currentTimeISOString: () => string;
  random: () => number;
  uuid: () => string;
  axiosInstance: AxiosStatic;
  docClient: DynamoDB.DocumentClient;
  userId: string;
}

const getUnitProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, id: string) => id,
  (sdk: CrudSdk, id: string) =>
    pipe(
      sdk.GetUnitProduct({ id }),
      throwIfEmptyValue(`UnitProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getUnitProduct =
  (sdk: CrudSdk) =>
  (id: string): Observable<UnitProduct> =>
    getUnitProductHelper(sdk, id);
