import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';

import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component';
import { AdminUserRoleFormComponent } from '../admin-user-role-form/admin-user-role-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-list-item',
  templateUrl: './admin-user-list-item.component.html',
  styleUrls: ['./admin-user-list-item.component.scss'],
})
export class AdminUserListItemComponent {
  @Input() adminUser!: CrudApi.AdminUser;

  constructor(private _nbDialogService: NbDialogService) {}

  editAdminUser(): void {
    const dialog = this._nbDialogService.open(AdminUserFormComponent);

    dialog.componentRef.instance.adminUser = fp.cloneDeep(this.adminUser);
  }

  editAdminUserRoles(): void {
    const dialog = this._nbDialogService.open(AdminUserRoleFormComponent);

    dialog.componentRef.instance.adminUserId = this.adminUser.id || '';
  }

  public resetEmail(): void {
    /*
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'auth.sendResetEmail',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._authService.sendPasswordResetEmail(this.adminUser.email || '').then(
              (): void => {
                this._toasterService.show(
                  EToasterType.SUCCESS,
                  '',
                  'auth.reminderSent'
                );
              },
              (): void => {
                this._toasterService.show(
                  EToasterType.DANGER,
                  '',
                  'auth.reminderError'
                );
              }
            );
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: () => {

          },
          status: 'basic',
        },
      ],
    };
    */
  }
}
