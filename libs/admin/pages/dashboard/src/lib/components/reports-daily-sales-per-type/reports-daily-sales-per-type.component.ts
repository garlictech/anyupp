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
import { reducer } from '@bgap/shared/utils';
import {
  EProductType,
  IKeyValueObject,
  IOrderAmounts,
} from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-daily-sales-per-type',
  templateUrl: './reports-daily-sales-per-type.component.html',
  styleUrls: ['./reports-daily-sales-per-type.component.scss'],
})
export class ReportsDailySalesPerTypeComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$!: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _currencyFormatter: CurrencyFormatterPipe,
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
                const sum = (
                  (<Chart.ChartDataSets[]>ctx.chart.data.datasets)[0]
                    .data as number[]
                ).reduce(reducer);
                const perc = ((value / sum) * 100).toFixed(0);
                return ` ${perc}%`;
              },
            },
          },
        },
      },
    );

    combineLatest([
      this._store.pipe(select(productsSelectors.getAllGeneratedProducts)),
      this.orders$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]) => {
        const amounts = this._orderAmounts(products, orders);

        (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].data = [
          amounts[EProductType.FOOD],
          amounts[EProductType.DRINK],
          amounts[EProductType.OTHER],
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

  private _orderAmounts(
    products: CrudApi.GeneratedProduct[],
    orders: CrudApi.Order[],
  ) {
    const amounts: IOrderAmounts = {
      [EProductType.DRINK]: 0,
      [EProductType.FOOD]: 0,
      [EProductType.OTHER]: 0,
    };

    const productTypeMap: IKeyValueObject = {};
    products.forEach(p => {
      productTypeMap[p.id] = p.productType;
    });

    orders.forEach(o => {
      o.items.forEach(i => {
        amounts[<EProductType>productTypeMap[i.productId]] +=
          i.priceShown.priceSum;
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
