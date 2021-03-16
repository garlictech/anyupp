import * as fp from 'lodash/fp';

import { Component, Input } from '@angular/core';
import { IUser } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';

import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'bgap-user-list-item',
  templateUrl: './user-list-item.component.html',
})
export class UserListItemComponent {
  @Input() user!: IUser;

  constructor(private _nbDialogService: NbDialogService) {}

  editUser(): void {
    const dialog = this._nbDialogService.open(UserFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.user = fp.cloneDeep(this.user);
  }
}
