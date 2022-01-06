import { Observable } from 'rxjs';
import { shareReplay, skipWhile } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import {
  ExtendedGroupProduct,
  ExtendedUnitProduct,
} from '@bgap/admin/store/products';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, ProductOrderChangeEvent } from '@bgap/shared/types';
import {
  NbDialogService,
  NbTabComponent,
  NbTabsetComponent,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductListService } from '../../services/product-list.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { FormControl } from '@angular/forms';

type GroupTabProducts = (ExtendedGroupProduct | CrudApi.ChainProduct) & {
  pending?: boolean;
};

type UnitTabProducts = (ExtendedUnitProduct | ExtendedGroupProduct) & {
  pending?: boolean;
};

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;
  public chainProducts: CrudApi.ChainProduct[] = [];
  public groupTabProducts: GroupTabProducts[] = [];
  public unitTabProducts: UnitTabProducts[] = [];
  public groupCurrency = '';
  public eProductLevel = EProductLevel;
  public selectedProductLevel: EProductLevel;
  public loggedUser$: Observable<CrudApi.AdminUser | undefined>;
  public searchControl: FormControl;
  private _sortedUnitProductIds: string[] = [];

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _productListService: ProductListService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.selectedProductLevel = EProductLevel.CHAIN;
    this.searchControl = new FormControl('');

    this.loggedUser$ = this._store
      .select(loggedUserSelectors.getLoggedUser)
      .pipe(untilDestroyed(this), shareReplay(1));
  }

  get dirtyChainProductsCount() {
    return (this.chainProducts || []).filter(p => p.dirty).length;
  }

  get pendingAndDirtyGroupProductsCount() {
    return (this.groupTabProducts || []).filter(p => p.pending || p.dirty)
      .length;
  }

  get pendingAndDirtyUnitProductsCount() {
    return (this.unitTabProducts || []).filter(p => p.pending || p.dirty)
      .length;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
        untilDestroyed(this),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this.groupCurrency = group?.currency || '';

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .chainProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((chainProducts: CrudApi.ChainProduct[]) => {
        this.chainProducts = chainProducts;

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .groupProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((groupTabProducts: GroupTabProducts[]) => {
        this.groupTabProducts = groupTabProducts;

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .unitProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((unitTabProducts: UnitTabProducts[]) => {
        this.unitTabProducts = unitTabProducts;
        this._sortedUnitProductIds = this.unitTabProducts.map(
          (p): string => p.id,
        );

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectLevel($event: NbTabComponent): void {
    this.selectedProductLevel = <EProductLevel>$event.tabId;

    // Trigger an event to fix CdkVirtualScroll height
    window.dispatchEvent(new Event('resize'));
  }

  public addProduct(): void {
    const dialog = this._nbDialogService.open(ProductFormComponent);

    dialog.componentRef.instance.productLevel = this.selectedProductLevel;
  }

  public unitProductPositionChange($event: ProductOrderChangeEvent) {
    this._productListService
      .unitProductPositionChange$($event, this._sortedUnitProductIds)
      .subscribe();
  }
}
