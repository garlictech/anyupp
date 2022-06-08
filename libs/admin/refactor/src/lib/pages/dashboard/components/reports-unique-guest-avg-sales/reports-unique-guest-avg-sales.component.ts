import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Order } from '@bgap/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { getDailyOrdersSum } from '../../../../shared/utils';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unique-guest-avg-sales',
  templateUrl: './reports-unique-guest-avg-sales.component.html',
  styleUrls: ['./reports-unique-guest-avg-sales.component.scss'],
})
export class ReportsUniqueGuestAvgSalesComponent implements OnInit {
  @Input() orders$?: Observable<Order[]>;
  @Input() currency = '';

  public uniqueUserCount = 0;
  public ordersSumAvg = 0;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.orders$) {
      this.orders$.pipe(untilDestroyed(this)).subscribe((orders: Order[]) => {
        this.uniqueUserCount = [...new Set(orders.map(o => o.userId))].length;
        const dailyOrdersSum = getDailyOrdersSum(orders);
        this.ordersSumAvg =
          this.uniqueUserCount > 0 ? dailyOrdersSum / this.uniqueUserCount : 0;

        this._changeDetectorRef.detectChanges();
      });
    }
  }
}
