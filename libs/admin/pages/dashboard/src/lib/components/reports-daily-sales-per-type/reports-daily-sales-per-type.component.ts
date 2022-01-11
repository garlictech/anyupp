import Chart from 'chart.js/auto';
import { Observable } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { dailySalesPerTypeOrderAmounts } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
  ) {}

  ngAfterViewInit(): void {
    this._chart = this._reportsService.createDailySalesPerTypeChart(
      this.chart,
      this.currency,
    );

    if (this.orders$) {
      this.orders$.pipe(untilDestroyed(this)).subscribe(orders => {
        const amounts = dailySalesPerTypeOrderAmounts(orders);

        this._chart.data.datasets[0].data = [
          amounts[EProductType.FOOD],
          amounts[EProductType.DRINK],
          amounts[EProductType.OTHER],
        ];

        this._chart.update();
      });
    }

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._chart.data.labels =
          this._reportsService.translatedProductTypeLabels();
        this._chart.update();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
