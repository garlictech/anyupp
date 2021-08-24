import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  dashboardActions,
  dashboardSelectors,
} from '@bgap/admin/shared/data-access/dashboard';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { calculateProductMix } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { IKeyValueObject, IProducMixArrayItem } from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-body',
  templateUrl: './reports-body.component.html',
  styleUrls: ['./reports-body.component.scss'],
})
export class ReportsBodyComponent implements OnInit, OnDestroy {
  public dateFormControl: FormControl;
  public incomeOrders$: BehaviorSubject<CrudApi.Order[]> = new BehaviorSubject<
    CrudApi.Order[]
  >([]);
  public noIncomeOrders$: BehaviorSubject<CrudApi.Order[]> =
    new BehaviorSubject<CrudApi.Order[]>([]);
  public unpayOrders$: BehaviorSubject<CrudApi.Order[]> = new BehaviorSubject<
    CrudApi.Order[]
  >([]);
  public rejectedOrders$: BehaviorSubject<CrudApi.Order[]> =
    new BehaviorSubject<CrudApi.Order[]>([]);
  public selectedUnit$: Observable<CrudApi.Unit>;
  public dailyOrdersSum: IKeyValueObject = {};
  public groupCurrency = '';
  public productMixData$: BehaviorSubject<IProducMixArrayItem[]> =
    new BehaviorSubject<IProducMixArrayItem[]>([]);

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.dateFormControl = new FormControl();

    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
        untilDestroyed(this),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this.groupCurrency = group?.currency || '';
      });

    this.selectedUnit$ = this._store.pipe(
      select(unitsSelectors.getSelectedUnit),
      filterNullish(),
      untilDestroyed(this),
    );
  }

  ngOnInit(): void {
    this._store
      .select(dashboardSelectors.getSelectedHistoryDate)
      .pipe(filterNullish(), take(1), untilDestroyed(this))
      .subscribe(historyDate => {
        this.dateFormControl = new FormControl(
          new Date(historyDate).toISOString().slice(0, 10),
        );

        this._store.dispatch(
          dashboardActions.updateSelectedUnitOrderHistory({ historyDate }),
        );

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._store.select(ordersSelectors.getAllHistoryOrders),
      this._store.select(productsSelectors.getAllGeneratedProducts),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([historyOrders, products]: [
          CrudApi.Order[],
          CrudApi.GeneratedProduct[],
        ]): void => {
          this.incomeOrders$.next(
            historyOrders.filter(
              o => CrudApi.orderHasIncome(o) && !CrudApi.isRejectedOrder(o),
            ),
          );
          this.noIncomeOrders$.next(
            historyOrders.filter(
              o => !CrudApi.orderHasIncome(o) && !CrudApi.isRejectedOrder(o),
            ),
          );
          this.unpayOrders$.next(
            historyOrders.filter(
              o => o.transactionStatus === CrudApi.PaymentStatus.failed,
            ),
          );
          this.rejectedOrders$.next(
            historyOrders.filter(o => CrudApi.isRejectedOrder(o)),
          );

          const productMix = calculateProductMix(
            historyOrders.filter(o => !CrudApi.isRejectedOrder(o)),
            products,
          );
          this.productMixData$.next(productMix);

          this._changeDetectorRef.detectChanges();
        },
      );

    this.dateFormControl.valueChanges.subscribe((): void => {
      this._store.dispatch(
        dashboardActions.setHistoryDate({
          historyDate: this.dateFormControl.value,
        }),
      );
    });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
