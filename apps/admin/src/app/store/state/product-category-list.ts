import { IProductCategory } from '../../shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IProductCategoryEntityState = EntityState<IProductCategory>;

export interface IProductCategoryListState {
  productCategories: IProductCategoryEntityState;
}
