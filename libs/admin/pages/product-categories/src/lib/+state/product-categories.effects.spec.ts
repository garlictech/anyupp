import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ProductCategoriesEffects } from './product-categories.effects';
import * as ProductCategoriesActions from './product-categories.actions';

describe('ProductCategoriesEffects', () => {
  let actions: Observable<any>;
  let effects: ProductCategoriesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ProductCategoriesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(ProductCategoriesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ProductCategoriesActions.init() });

      const expected = hot('-a-|', {
        a: ProductCategoriesActions.loadProductCategoriesSuccess({
          productCategories: [],
        }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
