import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { combineLatest, Observable } from 'rxjs';

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CurrencyFormatterPipe } from '@bgap/admin/shared/pipes';
import { EProductType, IOrder, IOrderAmounts, IProduct } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { reducer } from '../../../../shared/pure';
import { productListSelectors } from '../../../../store/selectors';

@UntilDestroy()
@Component({
  selector: 'bgap-reports-daily-sales-per-type',
  templateUrl: './reports-daily-sales-per-type.component.html',
  styleUrls: ['./reports-daily-sales-per-type.component.scss'],
})
export class ReportsDailySalesPerTypeComponent
  implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart: ElementRef<HTMLCanvasElement>;
  @Input() orders$: Observable<IOrder[]>;
  @Input() currency = '';

  private _chart: Chart;

  constructor(
    private _store: Store<any>,
    private _translateService: TranslateService,
    private _currencyFormatter: CurrencyFormatterPipe
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
        responsive: true,
        maintainAspectRatio: false,
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
              return ` ${perc}%`;
            },
          },
        },
      },
    });

    combineLatest([
      this._store.pipe(
        select(productListSelectors.getAllGeneratedUnitProducts)
      ),
      this.orders$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]: [IProduct[], IOrder[]]): void => {
        const amounts = this._orderAmounts(products, orders);

        this._chart.data.datasets[0].data = [
          amounts[EProductType.FOOD],
          amounts[EProductType.DRINK],
          amounts[EProductType.OTHER],
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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _orderAmounts(products: IProduct[], orders: IOrder[]) {
    const amounts: IOrderAmounts = {
      [EProductType.DRINK]: 0,
      [EProductType.FOOD]: 0,
      [EProductType.OTHER]: 0,
    };

    const productTypeMap = {};
    products.forEach(p => {
      productTypeMap[p._id] = p.productType;
    });

    orders.forEach(o => {
      o.items.forEach(i => {
        amounts[productTypeMap[i.productId]] += i.priceShown.priceSum;
      });
    });

    return amounts;
  }

  private _translatedLabels = (): string[] => [
    this._translateService.instant('products.productType.food'),
    this._translateService.instant('products.productType.drink'),
    this._translateService.instant('products.productType.other'),
  ];
}
