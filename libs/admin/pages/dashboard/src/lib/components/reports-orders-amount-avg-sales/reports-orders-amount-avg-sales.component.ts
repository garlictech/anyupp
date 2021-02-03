import { Observable } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getDailyOrdersSum } from '@bgap/admin/shared/data-access/orders';
import { IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'bgap-reports-orders-amount-avg-sales',
  templateUrl: './reports-orders-amount-avg-sales.component.html',
  styleUrls: ['./reports-orders-amount-avg-sales.component.scss'],
})
export class ReportsOrdersAmountAvgSalesComponent implements OnInit, OnDestroy {
  @Input() orders$!: Observable<IOrder[]>;
  @Input() currency = '';

  public ordersSum = 0;
  public ordersSumAvg = 0;

  ngOnInit(): void {
    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: IOrder[]): void => {
        this.ordersSum = getDailyOrdersSum(orders);
        this.ordersSumAvg =
          orders.length > 0 ? this.ordersSum / orders.length : 0;
      });
  }


  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
