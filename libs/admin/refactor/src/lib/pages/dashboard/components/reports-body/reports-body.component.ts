import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  dashboardActions,
  dashboardSelectors,
} from '../../../../store/dashboard';
import { groupsSelectors } from '../../../../store/groups';
import { OrderHistoryCollectionService } from '../../../../store/orders';
import { unitsSelectors } from '../../../../store/units';
import { calculateProductMix } from '../../../../shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValueObject, ProducMixArrayItem } from '@bgap/shared/types';
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
export class ReportsBodyComponent implements OnInit {
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
  public dailyOrdersSum: KeyValueObject = {};
  public groupCurrency = '';
  public productMixData$: BehaviorSubject<ProducMixArrayItem[]> =
    new BehaviorSubject<ProducMixArrayItem[]>([]);

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _orderHistoryCollectionService: OrderHistoryCollectionService,
  ) {
    this.dateFormControl = new FormControl();

    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
        untilDestroyed(this),
      )
      .subscribe((group: CrudApi.Group | undefined) => {
        this.groupCurrency = group?.currency || '';
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
        this.dateFormControl = new FormControl(
          new Date(historyDate).toISOString().slice(0, 10),
        );

        this._store.dispatch(
          dashboardActions.updateSelectedUnitOrderHistory({ historyDate }),
        );

        this._changeDetectorRef.detectChanges();
      });

    this._orderHistoryCollectionService.filteredEntities$
      .pipe(untilDestroyed(this))
      .subscribe((historyOrders: CrudApi.Order[]) => {
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
