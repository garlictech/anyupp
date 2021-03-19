import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import {
  AmplifyDataService,
  DataService,
} from '@bgap/admin/shared/data-access/data';
import { customNumberCompare } from '@bgap/shared/utils';
import {
  EAdminRole,
  EProductLevel,
  IAdminUser,
  IGroup,
  IProduct,
  IProductOrderChangeEvent,
} from '@bgap/shared/types';
import {
  NbDialogService,
  NbTabComponent,
  NbTabsetComponent,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductFormComponent } from '../product-form/product-form.component';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';

@UntilDestroy()
@Component({
  selector: 'bgap-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public chainProducts: IProduct[] = [];
  public groupProducts$: Observable<IProduct[]>;
  public pendingGroupProducts: IProduct[] = [];
  public pendingUnitProducts: IProduct[] = [];
  public groupCurrency = '';
  public unitProducts: IProduct[] = [];
  public EProductLevel = EProductLevel;
  public selectedProductLevel: EProductLevel;
  public adminUser?: IAdminUser;

  private _sortedChainProductIds: string[] = [];
  private _sortedUnitProductIds: string[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
    private _dataService: DataService,
    private _amplifyDataService: AmplifyDataService,
  ) {
    this.selectedProductLevel = EProductLevel.UNIT;

    this.groupProducts$ = this._store.pipe(
      select(productsSelectors.getExtendedGroupProductsOfSelectedCategory()),
      untilDestroyed(this),
    );
  }

  get selectedChainId(): string | null | undefined {
    return this.adminUser?.settings?.selectedChainId;
  }

  get selectedGroupId(): string | null | undefined {
    return this.adminUser?.settings?.selectedGroupId;
  }

  get selectedUnitId(): string | null | undefined {
    return this.adminUser?.settings?.selectedUnitId;
  }

  get selectedProductCategoryId(): string | null | undefined {
    return this.adminUser?.settings?.selectedProductCategoryId;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(productsSelectors.getChainProductsOfSelectedCategory()),
        map((products): IProduct[] =>
          products.sort(customNumberCompare('position')),
        ),
        untilDestroyed(this),
      )
      .subscribe((chainProducts: IProduct[]): void => {
        this.chainProducts = chainProducts;
        this._sortedChainProductIds = this.chainProducts.map(
          (p): string => p.id,
        );
      });

    this._store
      .pipe(
        select(productsSelectors.getExtendedUnitProductsOfSelectedCategory()),
        map((products): IProduct[] =>
          products.sort(customNumberCompare('position')),
        ),
        untilDestroyed(this),
      )
      .subscribe((unitProducts: IProduct[]): void => {
        this.unitProducts = unitProducts;
        this._sortedUnitProductIds = this.unitProducts.map((p): string => p.id);
      });

    combineLatest([
      this._store.pipe(
        select(productsSelectors.getPendingGroupProductsOfSelectedCategory()),
        untilDestroyed(this),
      ),
      this._store.pipe(
        select(productsSelectors.getPendingUnitProductsOfSelectedCategory()),
        untilDestroyed(this),
      ),
      this._store.pipe(
        select(loggedUserSelectors.getLoggedUser),
        skipWhile((adminUser): boolean => !adminUser),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([pendingGroupProducts, pendingUnitProducts, adminUser]: [
          IProduct[],
          IProduct[],
          IAdminUser,
        ]): void => {
          this.adminUser = adminUser;

          this.pendingGroupProducts = [
            EAdminRole.SUPERUSER,
            EAdminRole.CHAIN_ADMIN,
            EAdminRole.GROUP_ADMIN,
          ].includes(<EAdminRole>adminUser?.roles?.role)
            ? pendingGroupProducts
            : [];
          this.pendingUnitProducts = pendingUnitProducts;

          this._store
            .pipe(
              select(groupsSelectors.getSeletedGroup),
              skipWhile((group): boolean => !group),
              take(1),
            )
            .subscribe((group: IGroup | undefined): void => {
              this.groupCurrency = group?.currency || '';
            });
        },
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectLevel($event: NbTabComponent): void {
    this.selectedProductLevel = <EProductLevel>$event.tabId;
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

  public unitProductPositionChange($event: IProductOrderChangeEvent): void {
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
        $event.productId,
      );

      this._sortedUnitProductIds.forEach(
        async (productId: string, pos: number): Promise<void> => {
          if (this.selectedUnitId) {
            await this._amplifyDataService.update<IProduct>(
              'getUnitProduct',
              'updateUnitProduct',
              productId,
              (data: unknown) => ({
                ...(<IProduct>data),
                position: (pos + 1).toString(),
              }),
            );
          }
        },
      );
    }
  }
}
