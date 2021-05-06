import { IProductComponentSet } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductComponentSets] Init');

export const upsertProductComponentSet = createAction(
  '[ProductComponentSets] Upsert product component set',
  props<{ productComponentSet: IProductComponentSet }>(),
);

export const resetProductComponentSets = createAction(
  '[ProductComponentSets] Reset product component sets',
);
