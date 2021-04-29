import { IProductComponent } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductComponents] Init');

export const upsertProductComponent = createAction(
  '[ProductComponents] Upsert product component',
  props<{ productComponent: IProductComponent }>(),
);

export const resetProductComponents = createAction(
  '[ProductComponents] Reset product components',
);
