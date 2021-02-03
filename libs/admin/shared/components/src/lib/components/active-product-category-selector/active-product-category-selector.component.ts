import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IProductCategory } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-active-product-category-selector',
  templateUrl: './active-product-category-selector.component.html',
  styleUrls: ['./active-product-category-selector.component.scss'],
})
export class ActiveProductCategorySelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public productCategories$: Observable<IProductCategory[]>;
  private _adminUser!: IAdminUser;

  constructor(private _store: Store<any>, private _dataService: DataService) {
    this.showIcon = false;
    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this)
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedProductCategoryId(): string {
    return _get(this._adminUser, 'settings.selectedProductCategoryId');
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onProductCategorySelected(productCategoryId: string): void {
    if (
      _get(this._adminUser, '_id') &&
      productCategoryId !==
        _get(this._adminUser, 'settings.selectedProductCategoryId')
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser._id!, {
        ..._get(this._adminUser, 'settings', {}),
        selectedProductCategoryId: productCategoryId,
      });
    }
  }
}
