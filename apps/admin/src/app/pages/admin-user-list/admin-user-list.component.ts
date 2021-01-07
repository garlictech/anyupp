import { Observable } from 'rxjs';
import { IAdminUser } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import { adminUserListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';

@UntilDestroy()
@Component({
  selector: 'app-admin-user-list',
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
