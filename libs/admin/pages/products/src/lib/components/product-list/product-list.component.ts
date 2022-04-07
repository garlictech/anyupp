import { Observable } from 'rxjs';
import {
  debounceTime,
  shareReplay,
  skipWhile,
  startWith,
} from 'rxjs/operators';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { visibleLinesOnViewport } from '@bgap/admin/shared/utils';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
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
import {
  ExtendedUnitProduct,
  ExtendedGroupProduct,
} from '@bgap/admin/store/products';

type groupProducts = (ExtendedGroupProduct | CrudApi.ChainProduct) & {
  pending?: boolean;
};

type unitProducts = (ExtendedUnitProduct | ExtendedGroupProduct) & {
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
  @ViewChild('tabset')
  tabsetEl?: NbTabsetComponent;
  @ViewChild('chainProductsVSVP')
  chainProductsVSVP?: CdkVirtualScrollViewport;
  @ViewChild('groupProductsVSVP')
  groupProductsVSVP?: CdkVirtualScrollViewport;
  @ViewChild('unitProductsVSVP')
  unitProductsVSVP?: CdkVirtualScrollViewport;

  public chainProducts: CrudApi.ChainProduct[] = [];
  public groupProducts: groupProducts[] = [];
  public unitProducts: unitProducts[] = [];
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
    return (this.groupProducts || []).filter(p => p.pending || p.dirty).length;
  }

  get pendingAndDirtyUnitProductsCount() {
    return (this.unitProducts || []).filter(p => p.pending || p.dirty).length;
  }

  ngOnInit() {
    this._productListService.resetNextTokens();

    this.searchControl.valueChanges
      .pipe(debounceTime(200), startWith(''))
      .subscribe(searchValue => {
        this._productListService.updateLocalizedItemSearchValue(searchValue);
      });

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
      .chainProducts$()
      .pipe(untilDestroyed(this))
      .subscribe((chainProducts: CrudApi.ChainProduct[]) => {
        this.chainProducts = chainProducts;

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .groupProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((groupProducts: groupProducts[]) => {
        this.groupProducts = groupProducts;

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .unitProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((unitProducts: unitProducts[]) => {
        this.unitProducts = unitProducts;
        this._sortedUnitProductIds = this.unitProducts.map((p): string => p.id);

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

  public loadNextChainProductPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.chainProductsVSVP?.elementRef.nativeElement)
    ) {
      this._productListService.loadNextChainProductPaginatedData();
    }
  }

  public loadNextGroupProductPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.groupProductsVSVP?.elementRef.nativeElement)
    ) {
      this._productListService.loadNextGroupProductPaginatedData();
    }
  }

  public loadNextUnitProductPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.unitProductsVSVP?.elementRef.nativeElement)
    ) {
      this._productListService.loadNextUnitProductPaginatedData();
    }
  }
}
