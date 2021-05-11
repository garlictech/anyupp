import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { CrudSdkService } from '@bgap/admin/shared/data-access';
import { Store } from '@ngrx/store';
import { fromApolloSubscription } from '@bgap/crud-gql/api';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import * as fp from 'lodash/fp';
import { upsertProductCategory } from './product-categories.actions';

@Injectable()
export class ProductCategoriesEffects {
  watchChainProductCategories = createEffect(() =>
    this.store.select(loggedUserSelectors.getLoggedUserSettings).pipe(
      map(settings => settings?.selectedChainId),
      filter(fp.negate(fp.isEmpty)),
      map(x => x as string),
      distinctUntilChanged(fp.isEqual),
      switchMap(chainId =>
        fromApolloSubscription(
          this.crudSdk.OnProductCategoriesChange({
            filter: { chainId: { eq: chainId } },
          }),
        ).pipe(
          map(productCategory =>
            upsertProductCategory({
              productCategory,
            }),
          ),
        ),
      ),
    ),
  );

  constructor(private store: Store, private crudSdk: CrudSdkService) {}
}
