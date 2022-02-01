import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { getDailyOrdersSum } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unique-guest-avg-sales',
  templateUrl: './reports-unique-guest-avg-sales.component.html',
  styleUrls: ['./reports-unique-guest-avg-sales.component.scss'],
})
export class ReportsUniqueGuestAvgSalesComponent implements OnInit, OnDestroy {
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  public uniqueUserCount = 0;
  public ordersSumAvg = 0;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.orders$) {
      this.orders$
        .pipe(untilDestroyed(this))
        .subscribe((orders: CrudApi.Order[]): void => {
          this.uniqueUserCount = [...new Set(orders.map(o => o.userId))].length;
          const dailyOrdersSum = getDailyOrdersSum(orders);
          this.ordersSumAvg =
            this.uniqueUserCount > 0
              ? dailyOrdersSum / this.uniqueUserCount
              : 0;

          this._changeDetectorRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
