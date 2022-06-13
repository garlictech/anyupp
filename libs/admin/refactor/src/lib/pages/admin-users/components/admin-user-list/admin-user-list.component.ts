import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AdminUser } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { visibleLinesOnViewport } from '../../../../shared/utils';
import { AdminUserCollectionService } from '../../../../store/admin-users';
import { AdminUserListService } from '../../services/admin-user-list.service';
import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'],
})
export class AdminUserListComponent implements OnInit {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public adminUsers$: Observable<AdminUser[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _adminUserListService: AdminUserListService,
    private _adminUserCollectionService: AdminUserCollectionService,
  ) {
    this.adminUsers$ = this._adminUserCollectionService.filteredEntities$;
  }

  ngOnInit() {
    this._adminUserListService.resetNextTokens();
  }

  addUser() {
    this._nbDialogService.open(AdminUserFormComponent);
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._adminUserListService.loadNextPaginatedData();
    }
  }
}
