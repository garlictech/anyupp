import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, skipWhile } from 'rxjs/operators';

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import { dayInterval } from '@bgap/admin/shared/utils';
import { IGroup, IKeyValueObject, IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-reports-body',
  templateUrl: './reports-body.component.html',
  styleUrls: ['./reports-body.component.scss'],
})
export class ReportsBodyComponent implements OnDestroy {
  public dateFormControl: FormControl;
  public dailyHistoryOrders$!: BehaviorSubject<IOrder[]>;
  public dailyOrdersSum: IKeyValueObject = {};
  public groupCurrency: string = '';

  constructor(private _store: Store<any>) {
    this.dateFormControl = new FormControl();

    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
        untilDestroyed(this)
      )
      .subscribe((group: IGroup | undefined): void => {
        this.groupCurrency = group?.currency || '';
      });

    combineLatest([
      this._store.pipe(select(ordersSelectors.getAllHistoryOrders)),
      this.dateFormControl.valueChanges.pipe(filter((v): boolean => !!v)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([historyOrders, dateFormValue]: [IOrder[], string]): void => {
        // TODO Use history with daily query from FB
        const selectedDayInterval = dayInterval(dateFormValue);
        const dailyHistoryOrders: IOrder[] = historyOrders.filter(
          (o: IOrder): boolean =>
            o.created! >= selectedDayInterval.start &&
            o.created! <= selectedDayInterval.end
        );

        this.dailyHistoryOrders$.next(dailyHistoryOrders);
      });

    this.dateFormControl.setValue(new Date().toISOString().slice(0, 10));
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
