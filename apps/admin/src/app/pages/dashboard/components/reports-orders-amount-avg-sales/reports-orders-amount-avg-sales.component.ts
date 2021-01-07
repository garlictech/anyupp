import { Observable } from 'rxjs';
import { IOrder } from '../../shared/interfaces';
import { getDailyOrdersSum } from 'src/app/shared/pure';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-reports-orders-amount-avg-sales',
  templateUrl: './reports-orders-amount-avg-sales.component.html',
  styleUrls: ['./reports-orders-amount-avg-sales.component.scss'],
})
export class ReportsOrdersAmountAvgSalesComponent implements OnInit, OnDestroy {
  @Input() orders$: Observable<IOrder[]>;
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
