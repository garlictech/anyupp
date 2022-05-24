import { Observable } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
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
export class ReportsDayHistoryComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) chart!: ElementRef<HTMLCanvasElement>;
  @Input() orders$?: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  constructor(
    private _reportsService: ReportsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _translateService: TranslateService,
  ) {}

  ngAfterViewInit() {
    const chart = this._reportsService.createDayHistoryChart(this.chart);

    this._translateService.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        chart.data.labels = this._reportsService.translatedDayHistoryLabels();
        chart.update();
      });

    this._changeDetectorRef.detectChanges();
  }
}
