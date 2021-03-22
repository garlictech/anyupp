import { Observable } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _dataService: DataService) {
    this.showIcon = false;
    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedProductCategoryId(): string | null | undefined {
    return this._adminUser?.settings?.selectedProductCategoryId;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onProductCategorySelected(productCategoryId: string): void {
    if (
      this._adminUser?.id &&
      productCategoryId !== this._adminUser?.settings?.selectedProductCategoryId
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser.id || '', {
        ...(this._adminUser?.settings || {}),
        selectedProductCategoryId: productCategoryId,
      });
    }
  }
}
