import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Group } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { visibleLinesOnViewport } from '../../../../shared/utils';
import { GroupCollectionService } from '../../../../store/groups';
import { GroupListService } from '../../services/group-list.service';
import { GroupFormComponent } from '../group-form/group-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public groups$: Observable<Group[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _groupListService: GroupListService,
    private _groupCollectionService: GroupCollectionService,
  ) {
    this.groups$ = this._groupCollectionService.filteredEntities$;
  }

  public addGroup() {
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
