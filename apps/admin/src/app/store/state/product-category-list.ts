import { IProductCategory } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IProductCategoryEntityState extends EntityState<IProductCategory> {}

export interface IProductCategoryListState {
  productCategories: IProductCategoryEntityState;
}
