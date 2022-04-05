import { Observable } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '@bgap/admin/shared/utils';
import { AdminUserCollectionService } from '@bgap/admin/store/admin-users';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { AdminUserListService } from '../../services/admin-user-list.service';
import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'],
})
export class AdminUserListComponent implements OnDestroy {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public loading$: Observable<boolean>;
  public adminUsers$: Observable<CrudApi.AdminUser[]>;

  constructor(
    private _nbDialogService: NbDialogService,
    private _adminUserListService: AdminUserListService,
    private _adminUserCollectionService: AdminUserCollectionService,
  ) {
    this.adminUsers$ = this._adminUserCollectionService.filteredEntities$;
    this.loading$ = this._adminUserCollectionService.loading$;
  }

  ngOnInit() {
    this._adminUserListService.resetNextTokens();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  addUser(): void {
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
