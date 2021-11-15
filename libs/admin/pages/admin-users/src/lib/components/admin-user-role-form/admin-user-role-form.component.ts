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
import { adminUsersSelectors } from '@bgap/admin/shared/data-access/admin-users';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { roleContextsSelectors } from '@bgap/admin/shared/data-access/role-contexts';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
    private _crudSdk: CrudSdkService,
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
            .map(
              (roleContext): KeyValue => ({
                key: roleContext.id,
                value: roleContext.name,
              }),
            );

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
              this._crudSdk.sdk
                .DeleteAdminRoleContext({
                  input: {
                    id: roleContext.id,
                  },
                })
                .pipe(catchGqlError(this._store))
                .subscribe(() => {
                  this._toasterService.showSimpleSuccess(
                    'common.updateSuccessful',
                  );

                  this._changeDetectorRef.detectChanges();
                });
            }
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {
            /**/
          },
          status: 'basic',
        },
      ],
    };
  }

  public submit() {
    if (this.dialogForm?.valid && this.adminUser?.id) {
      this._crudSdk.sdk
        .CreateAdminRoleContext({
          input: {
            ...this.dialogForm?.value,
            adminUserId: this.adminUser.id,
          },
        })
        .pipe(catchGqlError(this._store))
        .subscribe(() => {
          this.dialogForm.patchValue({ roleContextId: '' });

          this._toasterService.showSimpleSuccess('common.insertSuccessful');

          this._changeDetectorRef.detectChanges();
        });
    }
  }
}
