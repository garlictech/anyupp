import { IProductCategory } from '@bgap/shared/types';

import { EntityState } from '@ngrx/entity';

export type IProductCategoryEntityState = EntityState<IProductCategory>;

export interface IProductCategoryListState {
  productCategories: IProductCategoryEntityState;
}
