import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Observable } from 'rxjs';

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { IState } from '../../../../store';

@UntilDestroy()
@Component({
  selector: 'bgap-reports-day-history',
  templateUrl: './reports-day-history.component.html',
  styleUrls: ['./reports-day-history.component.scss'],
})
export class ReportsDayHistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart: ElementRef<HTMLCanvasElement>;
  @Input() orders$: Observable<IOrder[]>;
  @Input() currency = '';

  private _chart: Chart;

  constructor(
    private _store: Store<IState>,
    private _translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(this.chart.nativeElement.getContext('2d'), {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: this._translatedLabels(),
        datasets: [
          {
            data: [4234, 1456, undefined],
            backgroundColor: ['#ffc107', '#3e95cd', '#8e5ea2'],
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: () => {
              return ''; //tooltipItem.yLabel;
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
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
            /* formatter: (value, ctx) => {
              console.error('value', value);
              console.error('ctx', ctx);
              const label = ctx.chart.data.datasets[ctx.datasetIndex].label;

              return label
            },*/
          },
        },
      },
    });

    /*
    this.orders$.pipe(untilDestroyed(this)).subscribe((orders: IOrder[]): void => {
      this.uniqueUserCount = [...new Set(orders.map(o => o.userId))].length;
      this.userStats = [];

      const dailyOrdersSum = getDailyOrdersSumPerCurrency(orders);

      for (let currency in dailyOrdersSum) {
        this.userStats.push({
          key: currency,
          value: Math.round(dailyOrdersSum[currency] / this.uniqueUserCount).toFixed(2),
        });
      }
    });


    combineLatest([this._store.pipe(select(productListSelectors.getAllGeneratedUnitProducts)), this.orders$])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]: [IProduct[], IOrder[]]): void => {
        const counts = this._countOrders(products, orders);

        this._chart.data.datasets[0].data = [
          counts[EProductType.FOOD],
          counts[EProductType.DRINK],
          counts[EProductType.OTHER],
        ];

        this._chart.update();
      });
    */

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels = this._translatedLabels();
        this._chart.update();
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('dashboard.reports.historyToday'),
    this._translateService.instant('dashboard.reports.history1W'),
    this._translateService.instant('dashboard.reports.history1Y'),
  ];
}
