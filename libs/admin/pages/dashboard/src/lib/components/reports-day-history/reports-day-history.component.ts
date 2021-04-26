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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { IOrder } from '@bgap/shared/types';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-day-history',
  templateUrl: './reports-day-history.component.html',
  styleUrls: ['./reports-day-history.component.scss'],
})
export class ReportsDayHistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$!: Observable<IOrder[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(
      <CanvasRenderingContext2D>this.chart.nativeElement.getContext('2d'),
      {
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
      },
    );

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

      this._changeDetectorRef.detectChanges();
    });


    combineLatest([this._store.pipe(select(productsSelectors.getAllGeneratedUnitProducts)), this.orders$])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]: [IProduct[], IOrder[]]): void => {
        const counts = this._countOrders(products, orders);

        this._chart.data.datasets[0].data = [
          counts[EProductType.FOOD],
          counts[EProductType.DRINK],
          counts[EProductType.OTHER],
        ];

        this._chart.update();

        this._changeDetectorRef.detectChanges();
      });
    */

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels = this._translatedLabels();
        this._chart.update();
      });

      this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('dashboard.reports.historyToday'),
    this._translateService.instant('dashboard.reports.history1W'),
    this._translateService.instant('dashboard.reports.history1Y'),
  ];
}
