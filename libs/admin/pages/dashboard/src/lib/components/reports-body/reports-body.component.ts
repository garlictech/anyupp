import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, skipWhile } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import { dayInterval } from '@bgap/shared/utils';
import { IKeyValueObject } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-body',
  templateUrl: './reports-body.component.html',
  styleUrls: ['./reports-body.component.scss'],
})
export class ReportsBodyComponent implements OnInit, OnDestroy {
  public dateFormControl: FormControl;
  public dailyHistoryOrders$: BehaviorSubject<
    CrudApi.Order[]
  > = new BehaviorSubject<CrudApi.Order[]>([]);
  public dailyOrdersSum: IKeyValueObject = {};
  public groupCurrency = '';

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.dateFormControl = new FormControl();
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

    combineLatest([
      this._store.pipe(select(ordersSelectors.getAllHistoryOrders)),
      this.dateFormControl.valueChanges.pipe(filter((v): boolean => !!v)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([historyOrders, dateFormValue]: [CrudApi.Order[], string]): void => {
          // TODO Use history with daily query from FB
          // TODO test it: new Date(o.createdAt).getTime()
          const selectedDayInterval = dayInterval(dateFormValue);
          const dailyHistoryOrders: CrudApi.Order[] = historyOrders.filter(
            (o: CrudApi.Order): boolean =>
              new Date(o.createdAt).getTime() >= selectedDayInterval.start &&
              new Date(o.createdAt).getTime() <= selectedDayInterval.end,
          );

          this.dailyHistoryOrders$.next(dailyHistoryOrders);

          this._changeDetectorRef.detectChanges();
        },
      );

    this.dateFormControl.setValue(new Date().toISOString().slice(0, 10));
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
