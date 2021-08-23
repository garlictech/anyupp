import * as Chart from 'chart.js';
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
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import { ReportsService } from '../../services/reports.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-day-history',
  templateUrl: './reports-day-history.component.html',
  styleUrls: ['./reports-day-history.component.scss'],
})
export class ReportsDayHistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  private _chart!: Chart;

  constructor(
    private _translateService: TranslateService,
    private _reportsService: ReportsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this._chart = this._reportsService.createDayHistoryChart(
      this.chart,
      this._translatedLabels,
    );

    /*
    this.orders$.pipe(untilDestroyed(this)).subscribe((orders: CrudApi.Order[]): void => {
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

    combineLatest([this._store.pipe(select(productsSelectors.getAllGeneratedProducts)), this.orders$])
      .pipe(untilDestroyed(this))
      .subscribe(([products, orders]: [Product[], CrudApi.Order[]]): void => {
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
