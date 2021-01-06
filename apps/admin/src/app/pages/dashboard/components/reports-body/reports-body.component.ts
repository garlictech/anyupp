import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, skipWhile } from 'rxjs/operators';
import { IGroup, IKeyValueObject, IOrder } from 'src/app/shared/interfaces';
import { dayInterval } from 'src/app/shared/pure';
import { IState } from 'src/app/store';
import { groupListSelectors, orderListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-reports-body',
  templateUrl: './reports-body.component.html',
  styleUrls: ['./reports-body.component.scss'],
})
export class ReportsBodyComponent implements OnDestroy {
  public dateFormControl: FormControl;
  public dailyHistoryOrders$: BehaviorSubject<IOrder[]> = new BehaviorSubject([]);
  public dailyOrdersSum: IKeyValueObject;
  public groupCurrency: string;

  constructor(private _store: Store<IState>) {
    this.dateFormControl = new FormControl();

    this._store
    .pipe(
      select(groupListSelectors.getSeletedGroup),
      skipWhile((group): boolean => !group),
      untilDestroyed(this)
    )
    .subscribe((group: IGroup): void => {
      this.groupCurrency = group?.currency || '';
    });

    combineLatest([
      this._store.pipe(select(orderListSelectors.getAllHistoryOrders)),
      this.dateFormControl.valueChanges.pipe(filter((v): boolean => !!v)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([historyOrders, dateFormValue]: [IOrder[], string]): void => {
        // TODO Use history with daily query from FB
        const selectedDayInterval = dayInterval(dateFormValue);
        const dailyHistoryOrders: IOrder[] = historyOrders.filter(
          (o: IOrder): boolean => o.created >= selectedDayInterval.start && o.created <= selectedDayInterval.end
        );

        this.dailyHistoryOrders$.next(dailyHistoryOrders);
      });

    this.dateFormControl.setValue(new Date().toISOString().slice(0, 10));
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
