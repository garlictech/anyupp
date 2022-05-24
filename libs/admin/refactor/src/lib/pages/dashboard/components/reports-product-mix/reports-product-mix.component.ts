import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { ProducMixArrayItem } from '@bgap/shared/types';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as CrudApi from '@bgap/crud-gql/api';
import { ReportsService } from '../../services/reports.service';
import { map, take } from 'rxjs/operators';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-product-mix',
  templateUrl: './reports-product-mix.component.html',
  styleUrls: ['./reports-product-mix.component.scss'],
})
export class ReportsProductMixComponent implements OnInit {
  @Input() productMixData$?: Observable<ProducMixArrayItem[]>;
  @Input() selectedUnit$?: Observable<CrudApi.Unit>;
  @Input() date?: Date;
  @Input() isModal = false;

  public productMixListData: ProducMixArrayItem[] = [];
  private _productMixFullData: ProducMixArrayItem[] = [];

  constructor(
    @Optional() private _nbDialogRef: NbDialogRef<unknown>,
    private _nbDialogService: NbDialogService,
    private _reportsService: ReportsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (this.productMixData$) {
      this.productMixData$
        .pipe(untilDestroyed(this))
        .subscribe((data: ProducMixArrayItem[]) => {
          this.productMixListData = this.isModal ? data : data.slice(0, 10);
          this._productMixFullData = data;

          this._changeDetectorRef.detectChanges();
        });
    }
  }

  public showFullProductMix() {
    if (this.productMixData$) {
      const dialog = this._nbDialogService.open(ReportsProductMixComponent);

      dialog.componentRef.instance.productMixData$ = this.productMixData$;
      dialog.componentRef.instance.isModal = true;
    }
  }

  public async export() {
    const unitName: string = this.selectedUnit$
      ? await this.selectedUnit$
          .pipe(
            take(1),
            map((unit: CrudApi.Unit) => unit.name),
          )
          .toPromise()
      : '';

    this._reportsService.exportProductMix(
      unitName,
      this.date || new Date(),
      this._productMixFullData,
    );
  }

  public close() {
    this._nbDialogRef.close();
  }
}
