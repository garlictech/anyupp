import * as Chart from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
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
import { hourlyBreakdownOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType, IOrderAmount } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { ReportsService } from '../../services/reports.service';

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
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() selectedUnit$?: Observable<CrudApi.Unit>;
  @Input() currency = '';

  private _chart!: Chart;
  private _amounts: IOrderAmount = {};

  constructor(
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = this._reportsService.createHourlyBreakdownChart(
      this.chart,
      this.currency,
      (value: number, ctx: Context) => {
        if (ctx.datasetIndex === 0) {
          return value > 0 ? value : '';
        } else {
          return this._amounts?.sum?.[ctx.dataIndex] > 0
            ? `${((value / this._amounts?.sum?.[ctx.dataIndex]) * 100).toFixed(
                0,
              )}%`
            : '';
        }
      },
    );

    if (this.selectedUnit$ && this.orders$) {
      combineLatest([this.selectedUnit$, this.orders$])
        .pipe(untilDestroyed(this))
        .subscribe(([unit, orders]): void => {
          this._amounts = hourlyBreakdownOrderAmounts(
            unit.timeZone || 'Europe/Budapest',
            orders,
          );

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
    }

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
