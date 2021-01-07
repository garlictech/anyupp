import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import { userListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UserFormComponent } from './components/user-form/user-form.component';

@UntilDestroy()
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  public users$: Observable<IUser[]>;

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.users$ = this._store.pipe(
      select(userListSelectors.getAllUsers),
      untilDestroyed(this)
    );
  }

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
