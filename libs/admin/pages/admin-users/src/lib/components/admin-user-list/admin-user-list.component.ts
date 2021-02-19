import { adminUsersSelectors } from '@bgap/admin/shared/data-access/admin-users';
import { Observable } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';
import { IAdminUser } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'],
})
export class AdminUserListComponent implements OnDestroy {
  public adminUsers$: Observable<IAdminUser[]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
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
    this._nbDialogService.open(AdminUserFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }
}
