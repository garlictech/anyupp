import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { IAdminUser, IProductCategory } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-product-category-selector',
  templateUrl: './active-product-category-selector.component.html',
  styleUrls: ['./active-product-category-selector.component.scss'],
})
export class ActiveProductCategorySelectorComponent
  implements OnInit, OnDestroy {
  @Input() showIcon: boolean;
  public productCategories$: Observable<IProductCategory[]>;
  private _loggedUser!: IAdminUser;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.showIcon = false;
    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this),
    );
  }

  get selectedProductCategoryId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedProductCategoryId;
  }

  ngOnInit(): void {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((loggedUser: IAdminUser): void => {
        this._loggedUser = loggedUser;

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onProductCategorySelected(productCategoryId: string): void {
    if (
      this._loggedUser?.id &&
      productCategoryId !==
        this._loggedUser?.settings?.selectedProductCategoryId
    ) {
      this._dataService.updateAdminUserSettings(this._loggedUser.id || '', {
        ...(this._loggedUser?.settings || {}),
        selectedProductCategoryId: productCategoryId,
      });
    }

    this._changeDetectorRef.detectChanges();
  }
}
