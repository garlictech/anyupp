import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Order, PaymentMethod } from '@bgap/domain';
import { UnpayCategoryStatObjItem } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { unpayCategoryTableData } from '../../../../shared/utils';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unpay-table',
  templateUrl: './reports-unpay-table.component.html',
  styleUrls: ['./reports-unpay-table.component.scss'],
})
export class ReportsUnpayTableComponent implements OnInit {
  @Input() orders$?: Observable<Order[]>;
  @Input() currency = '';
  @Input() hasIncome = false;

  public unpayCategoryStats: UnpayCategoryStatObjItem[] = [];
  public paymentMethods: PaymentMethod[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.orders$) {
      this.orders$.pipe(untilDestroyed(this)).subscribe((orders: Order[]) => {
        this.paymentMethods = <PaymentMethod[]>[
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
}
