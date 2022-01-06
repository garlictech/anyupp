import { combineLatest } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { adminUsersSelectors } from '@bgap/admin/store/admin-users';
import { roleContextsSelectors } from '@bgap/admin/store/role-contexts';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AdminUserFormService } from '../../services/admin-user-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
  styleUrls: ['./admin-user-role-form.component.scss'],
})
export class AdminUserRoleFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public adminUserId = '';
  public adminUser?: CrudApi.AdminUser;
  public roleContextOptions: KeyValue[] = [];

  constructor(
    protected _injector: Injector,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _adminUserFormService: AdminUserFormService,
  ) {
    super(_injector);
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      roleContextId: ['', [Validators.required]],
    });

    combineLatest([
      this._store.select(
        adminUsersSelectors.getAdminUserById(this.adminUserId),
      ),
      this._store.select(roleContextsSelectors.getAllRoleContexts),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([adminUser, roleContexts]): void => {
        if (adminUser) {
          this.adminUser = adminUser;

          const contextIds = (adminUser.roleContexts?.items || []).map(
            i => i?.roleContextId,
          );

          this.roleContextOptions = roleContexts
            .filter(c => !contextIds.includes(c.id))
            .map(roleContext => ({
              key: roleContext.id,
              value: roleContext.name,
            }));

          this._changeDetectorRef.detectChanges();
        }
      });
  }

  public removeRole(roleContext: CrudApi.Maybe<CrudApi.AdminRoleContext>) {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'roles.confirmRemoveRoleContext',
      buttons: [
        {
          label: 'common.ok',
          callback: () => {
            if (roleContext?.id) {
              this._adminUserFormService
                .deleteAdminRoleContext$(roleContext.id)
                .subscribe((response: UpsertResponse<unknown>) => {
                  this._toasterService.showSimpleSuccess(response.type);

                  this._changeDetectorRef.detectChanges();
                });
            }
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          status: 'basic',
        },
      ],
    };
  }

  public submit() {
    if (this.dialogForm?.valid && this.adminUser?.id) {
      this._adminUserFormService
        .createAdminRoleContext$({
          ...this.dialogForm?.value,
          adminUserId: this.adminUser.id,
        })
        .subscribe((response: UpsertResponse<unknown>) => {
          this.dialogForm.patchValue({ roleContextId: '' });
          this._toasterService.showSimpleSuccess(response.type);
          this._changeDetectorRef.detectChanges();
        });
    }
  }
}
