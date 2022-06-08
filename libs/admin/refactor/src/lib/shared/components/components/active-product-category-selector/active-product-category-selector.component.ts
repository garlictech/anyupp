import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AdminUser, ProductCategory } from '@bgap/domain';
import { filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { DataService } from '../../../../shared/data-access/data';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-product-category-selector',
  templateUrl: './active-product-category-selector.component.html',
  styleUrls: ['./active-product-category-selector.component.scss'],
})
export class ActiveProductCategorySelectorComponent implements OnInit {
  @Input() showIcon: boolean;
  @Output() selectionChange = new EventEmitter();
  public productCategories$: Observable<ProductCategory[]>;
  private _loggedUser!: AdminUser;

  constructor(
    private _store: Store,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {
    this.showIcon = false;
    this.productCategories$ =
      this._productCategoryCollectionService.filteredEntities$;
  }

  get selectedProductCategoryId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedProductCategoryId;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        filterNullish(),
        untilDestroyed(this),
      )
      .subscribe(loggedUser => {
        this._loggedUser = loggedUser;

        this._changeDetectorRef.detectChanges();
      });
  }

  public onProductCategorySelected(productCategoryId: string) {
    if (
      this._loggedUser?.id &&
      productCategoryId !==
        this._loggedUser?.settings?.selectedProductCategoryId
    ) {
      this._dataService
        .updateAdminUserSettings$(this._loggedUser.id, {
          ...(this._loggedUser?.settings || {}),
          selectedProductCategoryId: productCategoryId,
        })
        .subscribe(() => {
          this.selectionChange.emit();
        });
    }

    this._changeDetectorRef.detectChanges();
  }
}
