import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';
import { EPaymentMethod } from '../../shared/enums';
import { IOrder } from '../../shared/interfaces';
import { CurrencyFormatterPipe } from 'src/app/shared/pipes';
import { reducer } from 'src/app/shared/pure';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-reports-daily-sales-per-payment-method',
  templateUrl: './reports-daily-sales-per-payment-method.component.html',
  styleUrls: ['./reports-daily-sales-per-payment-method.component.scss'],
})
export class ReportsDailySalesPerPaymentMethodComponent
  implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart: ElementRef<HTMLCanvasElement>;
  @Input() orders$: Observable<IOrder[]>;
  @Input() currency = '';

  private _chart: Chart;

  constructor(
    private _currencyFormatter: CurrencyFormatterPipe,
    private _translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(this.chart.nativeElement.getContext('2d'), {
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
              const label = data.labels[tooltipItem.index] || '';
              const value: number =
                <number>data.datasets[0].data[tooltipItem.index] || 0;

              return ` ${label}: ${this._currencyFormatter.transform(
                value,
                this.currency
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
              const sum = (ctx.chart.data.datasets[0].data as number[]).reduce(
                reducer
              );
              const perc = ((value / sum) * 100).toFixed(0);
              return `${perc}%`;
            },
          },
        },
      },
    });

    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: IOrder[]): void => {
        const amounts = this._orderAmounts(orders);

        this._chart.data.datasets[0].data = [
          amounts[EPaymentMethod.CARD],
          amounts[EPaymentMethod.CASH],
          amounts[EPaymentMethod.INAPP],
        ];

        this._chart.update();
      });

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels = this._translatedLabels();
        this._chart.update();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _orderAmounts(orders: IOrder[]) {
    const amounts: any = {
      [EPaymentMethod.CARD]: 0,
      [EPaymentMethod.CASH]: 0,
      [EPaymentMethod.INAPP]: 0,
    };

    orders.forEach(o => {
      amounts[o.paymentMethod] += o.sumPriceShown.priceSum;
    });

    return amounts;
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('common.paymentModes.card'),
    this._translateService.instant('common.paymentModes.cash'),
    this._translateService.instant('common.paymentModes.inapp'),
  ];
}
