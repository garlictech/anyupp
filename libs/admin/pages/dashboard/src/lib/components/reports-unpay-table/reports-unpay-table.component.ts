import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  calculatePaymentMethodSums,
  calculateUnpayCategoryStat,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  UnpayCategoryStatObj,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  UNPAY_INCOME_CATEGORIES_ARR,
  UNPAY_NO_INCOME_CATEGORIES_ARR,
} from '@bgap/crud-gql/api';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unpay-table',
  templateUrl: './reports-unpay-table.component.html',
  styleUrls: ['./reports-unpay-table.component.scss'],
})
export class ReportsUnpayTableComponent implements OnDestroy {
  @Input() orders$!: Observable<CrudApi.Order[]>;
  @Input() currency = '';
  @Input() hasIncome = false;

  public unpayCategoryStats: UnpayCategoryStatObjItem[] = [];
  public paymentMethods: CrudApi.PaymentMethod[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: CrudApi.Order[]): void => {
        const unpayCategoryStatObj: UnpayCategoryStatObj = {};
        this.paymentMethods = [
          ...new Set(orders.map(o => o.paymentMode.method)),
        ];

        (this.hasIncome
          ? UNPAY_INCOME_CATEGORIES_ARR
          : UNPAY_NO_INCOME_CATEGORIES_ARR
        ).forEach(category => {
          unpayCategoryStatObj[category] = calculateUnpayCategoryStat(
            category,
            orders,
            this.paymentMethods,
          );
        });

        unpayCategoryStatObj['sum'] = {
          category: 'sum',
          count: Object.values(unpayCategoryStatObj).reduce(
            (prev, cur) => prev + cur.count,
            0,
          ),
          sum: Object.values(unpayCategoryStatObj).reduce(
            (prev, cur) => prev + cur.sum,
            0,
          ),
          paymentMethodSums: calculatePaymentMethodSums(
            this.paymentMethods,
            orders.filter(
              o =>
                o.unpayCategory &&
                (this.hasIncome
                  ? UNPAY_INCOME_CATEGORIES_ARR
                  : UNPAY_NO_INCOME_CATEGORIES_ARR
                ).includes(o.unpayCategory),
            ),
          ),
          uniqueUsersCount: [...new Set(orders.map(o => o.userId))].length,
        };

        this.unpayCategoryStats = Object.values(unpayCategoryStatObj);

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
