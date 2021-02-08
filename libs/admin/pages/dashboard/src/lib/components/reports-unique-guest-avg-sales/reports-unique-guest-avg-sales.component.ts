import { Observable } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getDailyOrdersSum } from '@bgap/admin/shared/data-access/orders';
import { IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'bgap-reports-unique-guest-avg-sales',
  templateUrl: './reports-unique-guest-avg-sales.component.html',
  styleUrls: ['./reports-unique-guest-avg-sales.component.scss'],
})
export class ReportsUniqueGuestAvgSalesComponent implements OnInit, OnDestroy {
  @Input() orders$!: Observable<IOrder[]>;
  @Input() currency = '';

  public uniqueUserCount = 0;
  public ordersSumAvg = 0;

  ngOnInit(): void {
    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: IOrder[]): void => {
        this.uniqueUserCount = [...new Set(orders.map(o => o.userId))].length;
        const dailyOrdersSum = getDailyOrdersSum(orders);
        this.ordersSumAvg =
          this.uniqueUserCount > 0 ? dailyOrdersSum / this.uniqueUserCount : 0;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
