import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Unit } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { visibleLinesOnViewport } from '../../../../shared/utils';
import { UnitCollectionService } from '../../../../store/units';
import { UnitListService } from '../../services/unit-list.service';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public units$: Observable<Unit[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _unitListService: UnitListService,
    private _unitCollectionService: UnitCollectionService,
  ) {
    this.units$ = this._unitCollectionService.filteredEntities$;
  }

  public addUnit() {
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
