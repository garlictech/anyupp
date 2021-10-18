import { pipe } from 'fp-ts/lib/function';
import * as Joi from 'joi';
import * as E from 'fp-ts/lib/Either';
import * as R from 'ramda';
import * as CrudApi from '@bgap/crud-gql/api';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { validateSchema } from '@bgap/shared/data-validators';

export interface ProductUpdateCommands {
  chain: CrudApi.UpdateChainProductInput;
  unit: CrudApi.UpdateUnitProductInput;
  group: CrudApi.UpdateGroupProductInput;
}

interface Dish {
  price: number;
  active: boolean;
  id: string;
  guid: string;
  name: string;
}

const dishSchema = {
  price: Joi.number().integer().positive().required(),
  active: Joi.number(),
  id: Joi.number().required(),
  guid: Joi.string().required(),
  name: Joi.string().required(),
};

export const { validate: validateDish, isType: isDish } = validateSchema<Dish>(
  dishSchema,
  'Dish',
  true,
);

export const normalizeDish = (dish: Dish) => ({
  ...dish,
  id: dish.id.toString(),
  name: decodeURIComponent(dish.name),
});

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
  pipe([productJson?.data?.dishes?.[0]]);
