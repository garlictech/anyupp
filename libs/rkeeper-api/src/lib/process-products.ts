import { pipe } from 'fp-ts/lib/function';
import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';
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

/*const searchExternalProduct =
  (sdk: CrudApi.CrudSdk) => (guid: string, id: string) =>
    sdk.SearchChainProducts({
      filter: {
        clientSideId: {
          eq: guid + id,
        },
      },
    });

//const itemUpdater = (sdk: CrudApi.CrudSdk) => (item: CrudApi.ChainProduct, externalData: any) =>

const handleUpdateChainProduct = (sdk: CrudApi.CrudSdk) => (dishData: any) => pipe( 
  !R.isEmpty(dishData?.guid) && !R.isEmpty(dishData?.id) ? of(dishData) 
  : throwError("Bad data, no id and/or guid"),
    switchMap((data) => searchExternalProduct(sdk)(data.guid, data.id)),
  map(res => res?.items?.[0])
)
*/
// any as this is the raw data from the net that we validate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processProducts = (productJson: any) =>
  pipe([productJson?.data?.dishes?.[0]]);
