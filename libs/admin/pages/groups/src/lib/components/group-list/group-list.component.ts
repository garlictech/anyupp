import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '@bgap/admin/shared/utils';
import { GroupCollectionService } from '@bgap/admin/store/groups';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { GroupListService } from '../../services/group-list.service';
import { GroupFormComponent } from '../group-form/group-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnDestroy {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public loading$: Observable<boolean>;
  public groups$: Observable<CrudApi.Group[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _groupListService: GroupListService,
    private _groupCollectionService: GroupCollectionService,
  ) {
    this.groups$ = this._groupCollectionService.filteredEntities$;
    this.loading$ = this._groupCollectionService.loading$;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addGroup(): void {
    this._nbDialogService.open(GroupFormComponent);
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._groupListService.loadNextPaginatedData();
    }
  }
}
