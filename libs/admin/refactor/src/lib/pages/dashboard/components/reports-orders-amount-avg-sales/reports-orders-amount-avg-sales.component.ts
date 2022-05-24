import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { getDailyOrdersSum } from '../../../../shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-orders-amount-avg-sales',
  templateUrl: './reports-orders-amount-avg-sales.component.html',
  styleUrls: ['./reports-orders-amount-avg-sales.component.scss'],
})
export class ReportsOrdersAmountAvgSalesComponent implements OnInit {
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  public ordersSum = 0;
  public ordersSumAvg = 0;
  public ordersCount = 0;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.orders$) {
      this.orders$
        .pipe(untilDestroyed(this))
        .subscribe((orders: CrudApi.Order[]) => {
          this.ordersSum = getDailyOrdersSum(orders);
          this.ordersCount = orders.length;
          this.ordersSumAvg =
            orders.length > 0 ? this.ordersSum / orders.length : 0;

          this._changeDetectorRef.detectChanges();
        });
    }
  }
}
