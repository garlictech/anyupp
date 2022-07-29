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
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AdminUser, UnitProduct } from '@bgap/domain';
import { ProductOrderChangeEvent } from '@bgap/shared/types';
import { NbDialogService, NbTabsetComponent } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { visibleLinesOnViewport } from '../../../../shared/utils';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { ProductListService } from '../../services/product-list.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { unitsSelectors } from '../../../../store/units';

type UnitProducts = UnitProduct & {
  pending?: boolean;
};

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild('tabset')
  tabsetEl?: NbTabsetComponent;
  @ViewChild('unitProductsVSVP')
  unitProductsVSVP?: CdkVirtualScrollViewport;

  public unitProducts: UnitProducts[] = [];
  public groupCurrency = '';
  public loggedUser$: Observable<AdminUser | undefined>;
  public searchControl: UntypedFormControl;

  private _sortedUnitProductIds: string[] = [];

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _productListService: ProductListService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.searchControl = new UntypedFormControl('');

    this.loggedUser$ = this._store
      .select(loggedUserSelectors.getLoggedUser)
      .pipe(untilDestroyed(this), shareReplay(1));
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
        select(unitsSelectors.getSelectedUnit),
        skipWhile((group): boolean => !group),
        untilDestroyed(this),
      )
      .subscribe(unit => {
        this.groupCurrency = unit?.currency || '';

        this._changeDetectorRef.detectChanges();
      });

    this._productListService
      .unitProducts$(this.searchControl.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe((unitProducts: UnitProducts[]) => {
        this.unitProducts = unitProducts;
        this._sortedUnitProductIds = this.unitProducts.map((p): string => p.id);
        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedProductCategoryId),
        skipWhile((categoryId): boolean => !categoryId),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.loadNextUnitProductPaginatedData(10, 0);
      });
  }

  public addProduct() {
    this._nbDialogService.open(ProductFormComponent);
  }

  public unitProductPositionChange($event: ProductOrderChangeEvent) {
    this._productListService
      .unitProductPositionChange$($event, this._sortedUnitProductIds)
      .subscribe();
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
