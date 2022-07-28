import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { isRejectedOrder, orderHasIncome } from '@bgap/crud-gql/api';
import { Order, PaymentStatus, Unit } from '@bgap/domain';
import { KeyValueObject, ProducMixArrayItem } from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { calculateProductMix } from '../../../../shared/utils';
import {
  dashboardActions,
  dashboardSelectors,
} from '../../../../store/dashboard';
import { OrderHistoryCollectionService } from '../../../../store/orders';
import { unitsSelectors } from '../../../../store/units';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-body',
  templateUrl: './reports-body.component.html',
  styleUrls: ['./reports-body.component.scss'],
})
export class ReportsBodyComponent implements OnInit {
  public dateFormControl: UntypedFormControl;
  public incomeOrders$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(
    [],
  );
  public noIncomeOrders$: BehaviorSubject<Order[]> = new BehaviorSubject<
    Order[]
  >([]);
  public unpayOrders$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(
    [],
  );
  public rejectedOrders$: BehaviorSubject<Order[]> = new BehaviorSubject<
    Order[]
  >([]);
  public selectedUnit$: Observable<Unit>;
  public dailyOrdersSum: KeyValueObject = {};
  public groupCurrency = '';
  public productMixData$: BehaviorSubject<ProducMixArrayItem[]> =
    new BehaviorSubject<ProducMixArrayItem[]>([]);

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _orderHistoryCollectionService: OrderHistoryCollectionService,
  ) {
    this.dateFormControl = new UntypedFormControl();

    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit): boolean => !unit),
        untilDestroyed(this),
      )
      .subscribe((unit: Unit | undefined) => {
        this.groupCurrency = unit?.currency || '';
      });

    this.selectedUnit$ = this._store.pipe(
      select(unitsSelectors.getSelectedUnit),
      filterNullish(),
      untilDestroyed(this),
    );
  }

  ngOnInit() {
    this._store
      .select(dashboardSelectors.getSelectedHistoryDate)
      .pipe(filterNullish(), take(1), untilDestroyed(this))
      .subscribe(historyDate => {
        this.dateFormControl = new UntypedFormControl(
          new Date(historyDate).toISOString().slice(0, 10),
        );

        this._store.dispatch(
          dashboardActions.updateSelectedUnitOrderHistory({ historyDate }),
        );

        this._changeDetectorRef.detectChanges();
      });

    this._orderHistoryCollectionService.filteredEntities$
      .pipe(untilDestroyed(this))
      .subscribe((historyOrders: Order[]) => {
        this.incomeOrders$.next(
          historyOrders.filter(o => orderHasIncome(o) && !isRejectedOrder(o)),
        );
        this.noIncomeOrders$.next(
          historyOrders.filter(o => !orderHasIncome(o) && !isRejectedOrder(o)),
        );
        this.unpayOrders$.next(
          historyOrders.filter(
            o => o.transactionStatus === PaymentStatus.failed,
          ),
        );
        this.rejectedOrders$.next(
          historyOrders.filter(o => isRejectedOrder(o)),
        );

        const productMix = calculateProductMix(
          historyOrders.filter(o => !isRejectedOrder(o)),
        );
        this.productMixData$.next(productMix);

        this._changeDetectorRef.detectChanges();
      });

    this.dateFormControl.valueChanges.subscribe(() => {
      this._store.dispatch(
        dashboardActions.setHistoryDate({
          historyDate: this.dateFormControl.value,
        }),
      );
    });
  }
}
