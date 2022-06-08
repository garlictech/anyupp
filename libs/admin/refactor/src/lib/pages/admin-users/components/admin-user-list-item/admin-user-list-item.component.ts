import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdminUser } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';

import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-list-item',
  templateUrl: './admin-user-list-item.component.html',
  styleUrls: ['./admin-user-list-item.component.scss'],
})
export class AdminUserListItemComponent {
  @Input() adminUser?: AdminUser;
  @Input() role?: string;

  constructor(private _nbDialogService: NbDialogService) {}

  editAdminUser() {
    const dialog = this._nbDialogService.open(AdminUserFormComponent);

    if (!this.adminUser) {
      throw new Error('HANDLE ME: handle undefined data');
    }
    dialog.componentRef.instance.adminUser = fp.cloneDeep(this.adminUser);
  }

  public resetEmail() {
    /*
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'auth.sendResetEmail',
      buttons: [
        {
          label: 'common.ok',
          callback: () => {
            this._authService.sendPasswordResetEmail(this.adminUser.email || '').then(
              () => {
                this._toasterService.showSimpleSuccess('auth.reminderSent');
              },
              () => {
                this._toasterService.showSimpleSuccess('auth.reminderError');
              }
            );
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          status: 'basic',
        },
      ],
    };
    */
  }
}
