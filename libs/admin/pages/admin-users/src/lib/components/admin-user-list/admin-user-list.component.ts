import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { adminUsersSelectors } from '@bgap/admin/shared/data-access/admin-users';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'],
})
export class AdminUserListComponent implements OnDestroy {
  public adminUsers$: Observable<CrudApi.AdminUser[]>;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {
    this.adminUsers$ = this._store.pipe(
      select(adminUsersSelectors.getAllAdminUsers),
      untilDestroyed(this),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  addUser(): void {
    this._nbDialogService.open(AdminUserFormComponent);
  }
}
