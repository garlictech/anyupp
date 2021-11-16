import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';

import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-list-item',
  templateUrl: './user-list-item.component.html',
})
export class UserListItemComponent {
  @Input() user!: CrudApi.User;

  constructor(private _nbDialogService: NbDialogService) {}

  editUser(): void {
    const dialog = this._nbDialogService.open(UserFormComponent);

    dialog.componentRef.instance.user = fp.cloneDeep(this.user);
  }
}
