import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { EAdminRole, EProductLevel, IAdminUser, IGroup, IProduct, IProductOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { NbDialogService, NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductFormComponent } from '../product-form/product-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public chainProducts$: Observable<IProduct[]>;
  public groupProducts$: Observable<IProduct[]>;
  public pendingGroupProducts: IProduct[] = [];
  public pendingUnitProducts: IProduct[] = [];
  public groupCurrency = '';
  public unitProducts: IProduct[] = [];
  public EProductLevel = EProductLevel;
  public selectedProductLevel: EProductLevel;
  public adminUser?: IAdminUser;

  private _sortedUnitProductIds: string[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
    private _amplifyDataService: AmplifyDataService,
  ) {
    this.selectedProductLevel = EProductLevel.UNIT;

    this.groupProducts$ = this._store.pipe(
      select(productsSelectors.getExtendedGroupProductsOfSelectedCategory()),
      untilDestroyed(this),
    );

    this.chainProducts$ = this._store
      .pipe(
        select(productsSelectors.getChainProductsOfSelectedCategory()),
        map((products): IProduct[] =>
          products.sort(customNumberCompare('position')),
        ),
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
          ].includes(<EAdminRole>adminUser?.role)
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

  public async unitProductPositionChange(
    $event: IProductOrderChangeEvent,
  ): Promise<void> {
    if (this.adminUser?.settings?.selectedUnitId) {
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

        for (let i = 0; i < this._sortedUnitProductIds.length; i++) {
          const productId = this._sortedUnitProductIds[i];

          await this._amplifyDataService.update<IProduct>(
            'getUnitProduct',
            'updateUnitProduct',
            productId,
            (data: unknown) => ({
              ...(<IProduct>data),
              position: (i + 1),
            }),
          );
        }
      }
    }
  }
}
