import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as R from 'ramda';
import * as CrudApi from '@bgap/crud-gql/api';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ProductUpdateCommands {
  unit: CrudApi.UpdateUnitProductInput;
  group: CrudApi.UpdateGroupProductInput;
  chain: CrudApi.UpdateChainProductInput;
}

const searchExternalProduct =
  (sdk: CrudApi.CrudSdk) => (guid: string, id: string) =>
    sdk.SearchChainProducts({
      filter: {
        clientSideId: {
          eq: guid + id,
        },
      },
    });

//const itemUpdater = (sdk: CrudApi.CrudSdk) => (item: CrudApi.ChainProduct, externalData: any) =>
/*
const handleUpdateChainProduct = (sdk: CrudApi.CrudSdk) => (dishData: any) => pipe( 
  !R.isEmpty(dishData?.guid) && !R.isEmpty(dishData?.id) ? of(dishData) 
  : throwError("Bad data, no id and/or guid"),
    switchMap((data) => searchExternalProduct(sdk)(data.guid, data.id)),
  map(res => res?.items?.[0])
)
*/

export const processProducts = (productJson: any) =>
  pipe(
    [productJson?.data?.dishes?.[0]],
    R.tap(x => console.warn(x)),
  );
