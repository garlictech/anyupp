import { combineLatest, Observable } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { EAdminRole, EProductLevel } from '@bgap/shared/types';
import { customNumberCompare, filterNullish } from '@bgap/shared/utils';
import {
  NbDialogService,
  NbTabComponent,
  NbTabsetComponent,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import * as CrudApi from '@bgap/crud-gql/api';
import { IProductOrderChangeEvent } from '@bgap/shared/types';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public chainProducts$: Observable<Product[]>;
  public groupProducts$: Observable<Product[]>;
  public pendingGroupProducts: Product[] = [];
  public pendingUnitProducts: Product[] = [];
  public groupCurrency = '';
  public unitProducts: Product[] = [];
  public eProductLevel = EProductLevel;
  public selectedProductLevel: EProductLevel;

  private _loggedUser?: CrudApi.AdminUser | null;
  private _sortedUnitProductIds: string[] = [];

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private crudSdk: CrudSdkService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.selectedProductLevel = EProductLevel.CHAIN;

    this.groupProducts$ = this._store.pipe(
      select(productsSelectors.getExtendedGroupProductsOfSelectedCategory()),
      untilDestroyed(this),
    );

    this.chainProducts$ = this._store.pipe(
      select(productsSelectors.getChainProductsOfSelectedCategory()),
      map((products): Product[] =>
        products.sort(customNumberCompare('position')),
      ),
      untilDestroyed(this),
    );
  }

  get selectedChainId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedChainId;
  }

  get selectedGroupId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedGroupId;
  }

  get selectedUnitId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedUnitId;
  }

  get selectedProductCategoryId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedProductCategoryId;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(productsSelectors.getExtendedUnitProductsOfSelectedCategory()),
        map((products): Product[] =>
          products.sort(customNumberCompare('position')),
        ),
        untilDestroyed(this),
      )
      .subscribe((unitProducts: Product[]): void => {
        this.unitProducts = unitProducts;
        this._sortedUnitProductIds = this.unitProducts.map((p): string => p.id);

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._store.pipe(
        select(productsSelectors.getPendingGroupProductsOfSelectedCategory()),
      ),
      this._store.pipe(
        select(productsSelectors.getPendingUnitProductsOfSelectedCategory()),
      ),
      this._store.pipe(
        select(loggedUserSelectors.getLoggedUser),
        filterNullish(),
      ),
      this._store.pipe(
        select(loggedUserSelectors.getLoggedUserRole),
        filterNullish(),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([pendingGroupProducts, pendingUnitProducts, _loggedUser, role]: [
          Product[],
          Product[],
          CrudApi.AdminUser,
          EAdminRole,
        ]): void => {
          this._loggedUser = _loggedUser;

          this.pendingGroupProducts = [
            EAdminRole.SUPERUSER,
            EAdminRole.CHAIN_ADMIN,
            EAdminRole.GROUP_ADMIN,
          ].includes(role)
            ? pendingGroupProducts
            : [];
          this.pendingUnitProducts = pendingUnitProducts;

          this._store
            .pipe(
              select(groupsSelectors.getSeletedGroup),
              skipWhile((group): boolean => !group),
              take(1),
            )
            .subscribe((group: CrudApi.Group | undefined): void => {
              this.groupCurrency = group?.currency || '';
            });

          this._changeDetectorRef.detectChanges();
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
    const dialog = this._nbDialogService.open(ProductFormComponent);

    dialog.componentRef.instance.productLevel = this.selectedProductLevel;
  }

  public async unitProductPositionChange(
    $event: IProductOrderChangeEvent,
  ): Promise<void> {
    if (this._loggedUser?.settings?.selectedUnitId) {
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

          await this.crudSdk.sdk
            .UpdateUnitProduct({
              input: {
                id: productId,
                position: i + 1,
              },
            })
            .toPromise();
        }
      }
    }
  }
}
