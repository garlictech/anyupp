import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { combineLatest, Observable } from 'rxjs';
import { EProductType } from 'src/app/shared/enums';
import { IOrder, IProduct } from 'src/app/shared/interfaces';
import { CurrencyFormatterPipe } from 'src/app/shared/pipes';
import { IState } from 'src/app/store';
import { productListSelectors } from 'src/app/store/selectors';

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-reports-hourly-breakdown',
  templateUrl: './reports-hourly-breakdown.component.html',
  styleUrls: ['./reports-hourly-breakdown.component.scss'],
})
export class ReportsHourlyBreakdownComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart: ElementRef<HTMLCanvasElement>;
  @Input() orders$: Observable<IOrder[]>;
  @Input() currency: string = '';

  private _chart: Chart;
  private _amounts: any;

  constructor(
    private _store: Store<IState>,
    private _currencyFormatter: CurrencyFormatterPipe,
    private _translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this._chart = new Chart(this.chart.nativeElement.getContext('2d'), {
      plugins: [ChartDataLabels],
      data: {
        labels: Array.from(Array(24).keys()),
        datasets: [
          {
            type: 'line',
            label: this._translateService.instant('dashboard.reports.ordersCount'),
            fill: true,
            data: new Array(24).fill(24),
            backgroundColor: 'rgba(249,94,1, 0.2)',
            borderColor: 'rgba(249,94,1, 0.8)',
            borderWidth: 2,
            yAxisID: 'y-axis-right',
          },
          {
            type: 'bar',
            label: this._translateService.instant('products.productType.food'),
            data: new Array(24).fill(20),
            backgroundColor: 'rgba(60,186,159, 0.8)',
            yAxisID: 'y-axis-left',
          },
          {
            type: 'bar',
            label: this._translateService.instant('products.productType.drink'),
            data: new Array(24).fill(23),
            backgroundColor: 'rgba(62,149,205,0.8)',
            yAxisID: 'y-axis-left',
          },
          {
            type: 'bar',
            label: this._translateService.instant('products.productType.other'),
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
              const label = data.datasets[tooltipItem.datasetIndex].label || '';

              return tooltipItem.datasetIndex === 0
                ? ` ${label}: ${tooltipItem.value}`
                : ` ${label}: ${this._currencyFormatter.transform(tooltipItem.value, this.currency)}`;
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
                return this._amounts?.sum?.[ctx.dataIndex] > 0 ? `${((value / this._amounts?.sum?.[ctx.dataIndex]) * 100).toFixed(0)}%` : '';
              }
            },
          },
        },
      },
    });

    combineLatest([this._store.pipe(select(productListSelectors.getAllGeneratedUnitProducts)), this.orders$])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]: [IProduct[], IOrder[]]): void => {
        this._amounts = this._orderAmounts(products, orders);

        this._chart.data.datasets[0].data = [...this._amounts.ordersCount];
        this._chart.data.datasets[1].data = [...this._amounts[EProductType.FOOD]];
        this._chart.data.datasets[2].data = [...this._amounts[EProductType.DRINK]];
        this._chart.data.datasets[3].data = [...this._amounts[EProductType.OTHER]];

        this._chart.update();
      });

    this._translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this._chart.data.datasets[0].label = this._translateService.instant('dashboard.reports.ordersCount');
      this._chart.data.datasets[1].label = this._translateService.instant('products.productType.food');
      this._chart.data.datasets[2].label = this._translateService.instant('products.productType.drink');
      this._chart.data.datasets[3].label = this._translateService.instant('products.productType.other');

      this._chart.update();
    });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _orderAmounts(products: IProduct[], orders: IOrder[]) {
    const amounts: any = {
      [EProductType.DRINK]: new Array(24).fill(0),
      [EProductType.FOOD]: new Array(24).fill(0),
      [EProductType.OTHER]: new Array(24).fill(0),
      ordersCount: new Array(24).fill(0),
      sum: new Array(24).fill(0),
    };

    const productTypeMap = {};
    products.forEach(p => {
      productTypeMap[p._id] = p.productType;
    });

    orders.forEach(o => {
      const hour = new Date(o.created).getHours();
      o.items.forEach(i => {
        amounts[productTypeMap[i.productId]][hour] += i.priceShown.priceSum;
        amounts['sum'][hour] += i.priceShown.priceSum;
      });

      amounts['ordersCount'][hour] += 1;
    });

    return amounts;
  }
}
