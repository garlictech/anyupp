import * as Chart from 'chart.js';
import { Observable } from 'rxjs';
import { Context } from 'vm';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { dailySalesPerPaymentMethodOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { reducer } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { ReportsService } from '../../services/reports.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-daily-sales-per-payment-method',
  templateUrl: './reports-daily-sales-per-payment-method.component.html',
  styleUrls: ['./reports-daily-sales-per-payment-method.component.scss'],
})
export class ReportsDailySalesPerPaymentMethodComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _reportsService: ReportsService,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = this._reportsService.createDailySalesPerPaymentMethodChart(
      this.chart,
      this.currency,
      this._translatedLabels,
      (value: number, ctx: Context) => {
        const sum = (
          (<Chart.ChartDataSets[]>ctx.chart.data.datasets)[0].data as number[]
        ).reduce(reducer);
        const percent = ((value / sum) * 100).toFixed(0);
        return `${percent}%`;
      },
    );

    if (this.orders$) {
      this.orders$
        .pipe(untilDestroyed(this))
        .subscribe((orders: CrudApi.Order[]): void => {
          const amounts = dailySalesPerPaymentMethodOrderAmounts(orders);

          (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].data = [
            amounts[CrudApi.PaymentMethod.card],
            amounts[CrudApi.PaymentMethod.cash],
            amounts[CrudApi.PaymentMethod.inapp],
          ];

          this._chart.update();

          this._changeDetectorRef.detectChanges();
        });
    }

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels = this._translatedLabels();
        this._chart.update();

        this._changeDetectorRef.detectChanges();
      });

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('common.paymentModes.card'),
    this._translateService.instant('common.paymentModes.cash'),
    this._translateService.instant('common.paymentModes.inapp'),
  ];
}
