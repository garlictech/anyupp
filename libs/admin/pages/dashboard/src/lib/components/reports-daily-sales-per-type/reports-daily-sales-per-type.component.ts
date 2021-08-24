import * as Chart from 'chart.js';
import { combineLatest, Observable } from 'rxjs';
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
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { dailySalesPerTypeOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType } from '@bgap/shared/types';
import { reducer } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { ReportsService } from '../../services/reports.service';

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
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = this._reportsService.createDailySalesPerTypeChart(
      this.chart,
      this.currency,
      this._translatedLabels,
      (value: number, ctx: Context) => {
        const sum = (
          (<Chart.ChartDataSets[]>ctx.chart.data.datasets)[0].data as number[]
        ).reduce(reducer);
        const perc = ((value / sum) * 100).toFixed(0);
        return ` ${perc}%`;
      },
    );

    if (this.orders$) {
      combineLatest([
        this._store.pipe(select(productsSelectors.getAllGeneratedProducts)),
        this.orders$,
      ])
        .pipe(untilDestroyed(this))
        .subscribe(([products, orders]) => {
          const amounts = dailySalesPerTypeOrderAmounts(products, orders);
          (<Chart.ChartDataSets[]>this._chart.data.datasets)[0].data = [
            amounts[EProductType.FOOD],
            amounts[EProductType.DRINK],
            amounts[EProductType.OTHER],
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
    this._translateService.instant('products.productType.food'),
    this._translateService.instant('products.productType.drink'),
    this._translateService.instant('products.productType.other'),
  ];
}
