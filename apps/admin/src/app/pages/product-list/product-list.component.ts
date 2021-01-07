import { get as _get } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';
import { EAdminRole, EProductLevel } from '../../shared/enums';
import { IAdminUser, IGroup, IProduct } from '../../shared/interfaces';
import { customNumberCompare } from 'src/app/shared/pure';
import { DataService } from 'src/app/shared/services/data';
import { IState } from '../../store';
import {
  currentUserSelectors,
  groupListSelectors,
  productListSelectors,
} from '../../store/selectors';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbTabsetComponent } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductFormComponent } from './components/product-form/product-form.component';

@UntilDestroy()
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl: NbTabsetComponent;

  public chainProducts: IProduct[];
  public groupProducts$: Observable<IProduct[]>;
  public pendingGroupProducts: IProduct[];
  public pendingUnitProducts: IProduct[];
  public groupCurrency: string;
  public unitProducts: IProduct[];
  public EProductLevel = EProductLevel;
  public selectedProductLevel: EProductLevel;
  public adminUser: IAdminUser;

  private _sortedChainProductIds: any[];
  private _sortedUnitProductIds: any[];

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService,
    private _dataService: DataService
  ) {
    this.selectedProductLevel = EProductLevel.UNIT;
  }

  get selectedChainId(): string {
    return _get(this.adminUser, 'settings.selectedChainId');
  }

  get selectedGroupId(): string {
    return _get(this.adminUser, 'settings.selectedGroupId');
  }

  get selectedUnitId(): string {
    return _get(this.adminUser, 'settings.selectedUnitId');
  }

  get selectedProductCategoryId(): string {
    return _get(this.adminUser, 'settings.selectedProductCategoryId');
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(productListSelectors.getChainProductsOfSelectedCategory()),
        map((products): IProduct[] =>
          products.sort(customNumberCompare('position'))
        ),
        untilDestroyed(this)
      )
      .subscribe((chainProducts: IProduct[]): void => {
        this.chainProducts = chainProducts;
        this._sortedChainProductIds = this.chainProducts.map(
          (p): string => p._id
        );
      });

    this.groupProducts$ = this._store.pipe(
      select(productListSelectors.getExtendedGroupProductsOfSelectedCategory()),
      untilDestroyed(this)
    );
    this._store
      .pipe(
        select(
          productListSelectors.getExtendedUnitProductsOfSelectedCategory()
        ),
        map((products): IProduct[] =>
          products.sort(customNumberCompare('position'))
        ),
        untilDestroyed(this)
      )
      .subscribe((unitProducts: IProduct[]): void => {
        this.unitProducts = unitProducts;
        this._sortedUnitProductIds = this.unitProducts.map(
          (p): string => p._id
        );
      });

    combineLatest([
      this._store.pipe(
        select(
          productListSelectors.getPendingGroupProductsOfSelectedCategory()
        ),
        untilDestroyed(this)
      ),
      this._store.pipe(
        select(productListSelectors.getPendingUnitProductsOfSelectedCategory()),
        untilDestroyed(this)
      ),
      this._store.pipe(
        select(currentUserSelectors.getAdminUser),
        skipWhile((adminUser): boolean => !adminUser)
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([pendingGroupProducts, pendingUnitProducts, adminUser]: [
          IProduct[],
          IProduct[],
          IAdminUser
        ]): void => {
          this.adminUser = adminUser;

          this.pendingGroupProducts = [
            EAdminRole.SUPERUSER,
            EAdminRole.CHAIN_ADMIN,
            EAdminRole.GROUP_ADMIN,
          ].includes(_get(adminUser, 'roles.role'))
            ? pendingGroupProducts
            : [];
          this.pendingUnitProducts = pendingUnitProducts;

          this._store
            .pipe(
              select(groupListSelectors.getSeletedGroup),
              skipWhile((group): boolean => !group),
              take(1)
            )
            .subscribe((group: IGroup): void => {
              this.groupCurrency = group.currency;
            });
        }
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectLevel($event: any): void {
    this.selectedProductLevel = $event.tabId;
  }

  public addProduct(): void {
    const dialog = this._nbDialogService.open(ProductFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.productLevel = this.selectedProductLevel;
  }

  public chainPositionChange($event: any): void {
    const idx = this._sortedChainProductIds.indexOf($event.productId);

    if (
      (idx >= 0 &&
        $event.change === 1 &&
        idx < this._sortedChainProductIds.length - 1) ||
      ($event.change === -1 && idx > 0)
    ) {
      this._sortedChainProductIds.splice(idx, 1);
      this._sortedChainProductIds.splice(
        idx + $event.change,
        0,
        $event.productId
      );

      this._sortedChainProductIds.forEach(
        (productId: string, pos: number): void => {
          this._dataService.updateChainProductPosition(
            this.selectedChainId,
            productId,
            (pos + 1).toString()
          );
        }
      );
    }
  }

  public unitPositionChange($event: any): void {
    const idx = this._sortedUnitProductIds.indexOf($event.productId);

    if (
      (idx >= 0 &&
        $event.change === 1 &&
        idx < this._sortedUnitProductIds.length - 1) ||
      ($event.change === -1 && idx > 0)
    ) {
      this._sortedUnitProductIds.splice(idx, 1);
      this._sortedUnitProductIds.splice(
        idx + $event.change,
        0,
        $event.productId
      );

      this._sortedUnitProductIds.forEach(
        (productId: string, pos: number): void => {
          this._dataService.updateUnitProductPosition(
            this.selectedUnitId,
            productId,
            (pos + 1).toString()
          );
        }
      );
    }
  }
}
