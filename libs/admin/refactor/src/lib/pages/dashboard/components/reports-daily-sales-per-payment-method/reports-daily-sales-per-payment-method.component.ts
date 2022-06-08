import Chart from 'chart.js/auto';
import { Observable } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { dailySalesPerPaymentMethodOrderAmounts } from '../../../../shared/utils';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { ReportsService } from '../../services/reports.service';
import { Order, PaymentMethod } from '@bgap/domain';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-daily-sales-per-payment-method',
  templateUrl: './reports-daily-sales-per-payment-method.component.html',
  styleUrls: ['./reports-daily-sales-per-payment-method.component.scss'],
})
export class ReportsDailySalesPerPaymentMethodComponent
  implements AfterViewInit
{
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$?: Observable<Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
  ) {}

  ngAfterViewInit() {
    this._chart = this._reportsService.createDailySalesPerPaymentMethodChart(
      this.chart,
      this.currency,
    );

    if (this.orders$) {
      this.orders$.pipe(untilDestroyed(this)).subscribe((orders: Order[]) => {
        const amounts = dailySalesPerPaymentMethodOrderAmounts(orders);

        this._chart.data.datasets[0].data = [
          amounts[PaymentMethod.card],
          amounts[PaymentMethod.cash],
          amounts[PaymentMethod.inapp],
        ];

        this._chart.update();
      });
    }

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels =
          this._reportsService.translatedPaymentModeLabels();
        this._chart.update();
      });
  }
}
