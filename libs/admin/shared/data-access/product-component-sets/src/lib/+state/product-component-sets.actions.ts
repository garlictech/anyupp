import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductComponentSets] Init');

export const upsertProductComponentSets = createAction(
  '[ProductComponentSets] Upsert product component sets',
  props<{ productComponentSets: CrudApi.ProductComponentSet[] }>(),
);

export const resetProductComponentSets = createAction(
  '[ProductComponentSets] Reset product component sets',
);
