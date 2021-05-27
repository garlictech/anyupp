import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';

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
import * as CrudApi from '@bgap/crud-gql/api';
import { CurrencyFormatterPipe } from '@bgap/admin/shared/pipes';
import { reducer } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { IOrderAmounts } from '@bgap/shared/types';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-daily-sales-per-payment-method',
  templateUrl: './reports-daily-sales-per-payment-method.component.html',
  styleUrls: ['./reports-daily-sales-per-payment-method.component.scss'],
})
export class ReportsDailySalesPerPaymentMethodComponent
  implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$!: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _currencyFormatter: CurrencyFormatterPipe,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(
      <CanvasRenderingContext2D>this.chart.nativeElement.getContext('2d'),
      {
        type: 'pie',
        plugins: [ChartDataLabels],
        data: {
          labels: this._translatedLabels(),
          datasets: [
            {
              backgroundColor: ['#3cba9f', '#3e95cd', '#8e5ea2'],
              data: [0, 0, 0],
            },
          ],
        },
        options: {
          legend: {
            position: 'bottom',
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  (<string[]>data.labels)[tooltipItem.index || 0] || '';
                const value: number =
                  <number>(
                    (<Chart.ChartDataSets[]>(
                      (<Chart.ChartDataSets[]>data.datasets)[0].data
                    ))[tooltipItem.index || 0]
                  ) || 0;

                return ` ${label}: ${this._currencyFormatter.transform(
                  value,
                  this.currency,
                )}`;
              },
            },
          },
          plugins: {
            datalabels: {
              color: 'white',
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                  },
                },
              },
              formatter: (value, ctx) => {
                const sum = ((<Chart.ChartDataSets[]>ctx.chart.data.datasets)[0]
                  .data as number[]).reduce(reducer);
                const perc = ((value / sum) * 100).toFixed(0);
                return `${perc}%`;
              },
            },
          },
        },
      },
    );

    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: CrudApi.Order[]): void => {
        const amounts = this._orderAmounts(orders);

        (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].data = [
          amounts[CrudApi.PaymentMethod.card],
          amounts[CrudApi.PaymentMethod.cash],
          amounts[CrudApi.PaymentMethod.inapp],
        ];

        this._chart.update();

        this._changeDetectorRef.detectChanges();
      });

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

  private _orderAmounts(orders: CrudApi.Order[]) {
    const amounts: IOrderAmounts = {
      [CrudApi.PaymentMethod.card]: 0,
      [CrudApi.PaymentMethod.cash]: 0,
      [CrudApi.PaymentMethod.inapp]: 0,
    };

    orders.forEach(o => {
      amounts[o.paymentMode.method] += o.sumPriceShown.priceSum;
    });

    return amounts;
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('common.paymentModes.card'),
    this._translateService.instant('common.paymentModes.cash'),
    this._translateService.instant('common.paymentModes.inapp'),
  ];
}
