import { ChartDataset } from 'chart.js';
import Chart from 'chart.js/auto';
import { Context } from 'chartjs-plugin-datalabels';
import { combineLatest, Observable } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { hourlyBreakdownOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType, OrderAmount } from '@bgap/shared/types';
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
  private _amounts: OrderAmount = {};

  constructor(
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
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

          (<ChartDataset[]>this._chart.data.datasets)[0].data = [
            ...this._amounts.ordersCount,
          ];
          (<ChartDataset[]>this._chart.data.datasets)[1].data = [
            ...this._amounts[EProductType.FOOD],
          ];
          (<ChartDataset[]>this._chart.data.datasets)[2].data = [
            ...this._amounts[EProductType.DRINK],
          ];
          (<ChartDataset[]>this._chart.data.datasets)[3].data = [
            ...this._amounts[EProductType.OTHER],
          ];
          (<ChartDataset[]>this._chart.data.datasets)[4].data = [
            ...this._amounts[EProductType.TIP],
          ];

          this._chart.update();
        });
    }

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.datasets[0].label = this._translateService.instant(
          'dashboard.reports.ordersCount',
        );
        this._chart.data.datasets[1].label = this._translateService.instant(
          'products.productType.food',
        );
        this._chart.data.datasets[2].label = this._translateService.instant(
          'products.productType.drink',
        );
        this._chart.data.datasets[3].label = this._translateService.instant(
          'products.productType.other',
        );

        this._chart.update();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
