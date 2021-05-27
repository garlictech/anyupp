import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { usersSelectors } from '@bgap/admin/shared/data-access/users';
import { IUser } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UserFormComponent } from '../user-form/user-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnDestroy {
  public users$: Observable<IUser[]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {
    this.users$ = this._store.pipe(
      select(usersSelectors.getAllUsers),
      untilDestroyed(this),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  addUser(): void {
    this._nbDialogService.open(UserFormComponent);
  }
}
