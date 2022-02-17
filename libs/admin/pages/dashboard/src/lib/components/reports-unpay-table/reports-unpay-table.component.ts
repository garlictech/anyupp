import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { unpayCategoryTableData } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { UnpayCategoryStatObjItem } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unpay-table',
  templateUrl: './reports-unpay-table.component.html',
  styleUrls: ['./reports-unpay-table.component.scss'],
})
export class ReportsUnpayTableComponent implements OnInit, OnDestroy {
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';
  @Input() hasIncome = false;

  public unpayCategoryStats: UnpayCategoryStatObjItem[] = [];
  public paymentMethods: CrudApi.PaymentMethod[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.orders$) {
      this.orders$
        .pipe(untilDestroyed(this))
        .subscribe((orders: CrudApi.Order[]): void => {
          this.paymentMethods = <CrudApi.PaymentMethod[]>[
            ...new Set(orders.map(o => o.paymentMode?.method).filter(m => !!m)),
          ];

          this.unpayCategoryStats = unpayCategoryTableData(
            orders,
            this.hasIncome,
            this.paymentMethods,
          );

          this._changeDetectorRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
