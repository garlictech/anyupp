import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ProductCategoriesFeature from './product-categories.reducer';
import * as ProductCategoriesActions from './product-categories.actions';

@Injectable()
export class ProductCategoriesEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCategoriesActions.init),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ProductCategoriesActions.loadProductCategoriesSuccess({
            productCategories: [],
          });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ProductCategoriesActions.loadProductCategoriesFailure({
            error,
          });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
