import { Observable } from 'rxjs';
import { IAdminUser } from '@bgap/shared/types/interfaces';
import { IState } from '../../store';
import { adminUserListSelectors } from '../../store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-admin-user-list',
  templateUrl: './admin-user-list.component.html',
})
export class AdminUserListComponent implements OnInit, OnDestroy {
  public adminUsers$: Observable<IAdminUser[]>;

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.adminUsers$ = this._store.pipe(
      select(adminUserListSelectors.getAllAdminUsers),
      untilDestroyed(this)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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
