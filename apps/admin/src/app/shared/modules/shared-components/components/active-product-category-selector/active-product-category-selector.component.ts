import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { IAdminUser, IProductCategory } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data';
import { IState } from 'src/app/store';
import {
  currentUserSelectors,
  productCategoryListSelectors,
} from 'src/app/store/selectors';

import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-active-product-category-selector',
  templateUrl: './active-product-category-selector.component.html',
  styleUrls: ['./active-product-category-selector.component.scss'],
})
export class ActiveProductCategorySelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public productCategories$: Observable<IProductCategory[]>;
  private _adminUser: IAdminUser;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService
  ) {
    this.showIcon = false;
    this.productCategories$ = this._store.pipe(
      select(productCategoryListSelectors.getAllProductCategories),
      untilDestroyed(this)
    );

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedProductCategoryId(): string {
    return _get(this._adminUser, 'settings.selectedProductCategoryId');
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onProductCategorySelected(productCategoryId: string): void {
    if (
      _get(this._adminUser, '_id') &&
      productCategoryId !==
        _get(this._adminUser, 'settings.selectedProductCategoryId')
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser._id, {
        ..._get(this._adminUser, 'settings', {}),
        selectedProductCategoryId: productCategoryId,
      });
    }
  }
}
