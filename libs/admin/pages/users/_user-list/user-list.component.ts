import { Observable } from 'rxjs';
import { IUser } from '@bgap/shared/types';
import { IState } from '../../store';
import { userListSelectors } from '../../store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UserFormComponent } from './components/user-form/user-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  public users$: Observable<IUser[]>;

  constructor(
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.users$ = this._store.pipe(
      select(userListSelectors.getAllUsers),
      untilDestroyed(this)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  addUser(): void {
    this._nbDialogService.open(UserFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }
}
