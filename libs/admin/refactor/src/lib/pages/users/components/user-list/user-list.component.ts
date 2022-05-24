import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { usersSelectors } from '../../../../store/users';
import * as CrudApi from '@bgap/crud-gql/api';
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
export class UserListComponent {
  public users$: Observable<CrudApi.User[]>;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {
    this.users$ = this._store.pipe(
      select(usersSelectors.getAllUsers),
      untilDestroyed(this),
    );
  }

  addUser() {
    this._nbDialogService.open(UserFormComponent);
  }
}
