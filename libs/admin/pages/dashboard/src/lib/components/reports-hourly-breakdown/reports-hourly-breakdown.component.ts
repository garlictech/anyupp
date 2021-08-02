import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { combineLatest, Observable } from 'rxjs';

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
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { CurrencyFormatterPipe } from '@bgap/admin/shared/pipes';
import { hourlyBreakdownOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType, IOrderAmount } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-hourly-breakdown',
  templateUrl: './reports-hourly-breakdown.component.html',
  styleUrls: ['./reports-hourly-breakdown.component.scss'],
})
export class ReportsHourlyBreakdownComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$!: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;
  private _amounts: IOrderAmount = {};

  constructor(
    private _store: Store,
    private _currencyFormatter: CurrencyFormatterPipe,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(
      <CanvasRenderingContext2D>this.chart.nativeElement.getContext('2d'),
      {
        plugins: [ChartDataLabels],
        data: {
          labels: Array.from(Array(24).keys()),
          datasets: [
            {
              type: 'line',
              label: this._translateService.instant(
                'dashboard.reports.ordersCount',
              ),
              fill: true,
              data: new Array(24).fill(24),
              backgroundColor: 'rgba(249,94,1, 0.2)',
              borderColor: 'rgba(249,94,1, 0.8)',
              borderWidth: 2,
              yAxisID: 'y-axis-right',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.food',
              ),
              data: new Array(24).fill(20),
              backgroundColor: 'rgba(60,186,159, 0.8)',
              yAxisID: 'y-axis-left',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.drink',
              ),
              data: new Array(24).fill(23),
              backgroundColor: 'rgba(62,149,205,0.8)',
              yAxisID: 'y-axis-left',
            },
            {
              type: 'bar',
              label: this._translateService.instant(
                'products.productType.other',
              ),
              data: new Array(24).fill(24),
              backgroundColor: 'rgba(142,94,162,0.8)',
              yAxisID: 'y-axis-left',
            },
          ],
        },
        options: {
          legend: {
            position: 'bottom',
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                id: 'y-axis-left',
              },
              {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
                position: 'right',
                id: 'y-axis-right',
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label =
                  (<Chart.ChartDataSets[]>data.datasets)[
                    tooltipItem.datasetIndex || 0
                  ].label || '';

                return tooltipItem.datasetIndex === 0
                  ? ` ${label}: ${tooltipItem.value}`
                  : ` ${label}: ${this._currencyFormatter.transform(
                      tooltipItem.value || '',
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
                if (ctx.datasetIndex === 0) {
                  return value > 0 ? value : '';
                } else {
                  return this._amounts?.sum?.[ctx.dataIndex] > 0
                    ? `${(
                        (value / this._amounts?.sum?.[ctx.dataIndex]) *
                        100
                      ).toFixed(0)}%`
                    : '';
                }
              },
            },
          },
        },
      },
    );

    combineLatest([
      this._store.select(productsSelectors.getAllGeneratedProducts),
      this.orders$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]): void => {
        this._amounts = hourlyBreakdownOrderAmounts(products, orders);

        (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].data = [
          ...this._amounts.ordersCount,
        ];
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[1].data = [
          ...this._amounts[EProductType.FOOD],
        ];
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[2].data = [
          ...this._amounts[EProductType.DRINK],
        ];
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[3].data = [
          ...this._amounts[EProductType.OTHER],
        ];

        this._chart.update();

        this._changeDetectorRef.detectChanges();
      });

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].label =
          this._translateService.instant('dashboard.reports.ordersCount');
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[1].label =
          this._translateService.instant('products.productType.food');
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[2].label =
          this._translateService.instant('products.productType.drink');
        (<Chart.ChartDataSets[]>this._chart.data.datasets)[3].label =
          this._translateService.instant('products.productType.other');

        this._chart.update();

        this._changeDetectorRef.detectChanges();
      });

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
