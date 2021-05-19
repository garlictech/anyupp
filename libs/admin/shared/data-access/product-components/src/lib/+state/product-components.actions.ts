import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[ProductComponents] Init');

export const upsertProductComponents = createAction(
  '[ProductComponents] Upsert product components',
  props<{ productComponents: CrudApi.ProductComponent[] }>(),
);

export const resetProductComponents = createAction(
  '[ProductComponents] Reset product components',
);
