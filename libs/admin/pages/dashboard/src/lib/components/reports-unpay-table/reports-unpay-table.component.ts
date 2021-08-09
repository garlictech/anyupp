import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { calculateUnpayCategoryStat } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  UnpayCategoryStatObj,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UNPAY_CATEGORIES_ARR } from '@bgap/crud-gql/api';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-unpay-table',
  templateUrl: './reports-unpay-table.component.html',
  styleUrls: ['./reports-unpay-table.component.scss'],
})
export class ReportsUnpayTableComponent implements OnDestroy {
  @Input() orders$!: Observable<CrudApi.Order[]>;
  @Input() currency = '';

  public unpayCategories: CrudApi.UnpayCategory[] = UNPAY_CATEGORIES_ARR;
  public unpayCategoryStats: UnpayCategoryStatObjItem[] = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.orders$
      .pipe(untilDestroyed(this))
      .subscribe((orders: CrudApi.Order[]): void => {
        const unpayCategoryStatObj: UnpayCategoryStatObj = {};
        UNPAY_CATEGORIES_ARR.forEach(category => {
          unpayCategoryStatObj[category] = calculateUnpayCategoryStat(
            category,
            orders,
          );
        });
        this.unpayCategoryStats = Object.values(unpayCategoryStatObj);

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }
}
