import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '@bgap/admin/shared/utils';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { UnitCollectionService } from '@bgap/admin/store/units';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UnitListService } from '../../services/unit-list.service';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnDestroy {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public units$: Observable<CrudApi.Unit[]>;
  public selectedGroupId$: Observable<string | undefined | null>;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _unitListService: UnitListService,
    private _unitCollectionService: UnitCollectionService,
  ) {
    this.selectedGroupId$ = this._store.pipe(
      select(loggedUserSelectors.getSelectedGroupId),
      untilDestroyed(this),
    );

    this.units$ = this._unitCollectionService.filteredEntities$;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addUnit(): void {
    this._nbDialogService.open(UnitFormComponent);
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._unitListService.loadNextPaginatedData();
    }
  }
}
