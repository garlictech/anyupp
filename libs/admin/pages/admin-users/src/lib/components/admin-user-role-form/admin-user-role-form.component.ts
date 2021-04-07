import { take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
import { adminUsersSelectors } from '@bgap/admin/shared/data-access/admin-users';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  IAdminUser,
  IAdminUserConnectedRoleContext,
  IKeyValue,
  IRoleContext,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from 'libs/admin/shared/components/src';
import { EToasterType } from 'libs/admin/shared/utils/src';
import { combineLatest, Observable } from 'rxjs';
import { roleContextsSelectors } from 'libs/admin/shared/data-access/role-contexts/src';
import { Validators } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
  styleUrls: ['./admin-user-role-form.component.scss'],
})
export class AdminUserRoleFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUserId: string = '';
  public adminUser: IAdminUser = {};
  public roleContextOptions: IKeyValue[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    protected _injector: Injector,
    private _amplifyDataService: AmplifyDataService,
    private _nbDialogService: NbDialogService,
  ) {
    super(_injector);
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      roleContextId: ['', [Validators.required]],
    });

    combineLatest([
      this._store.pipe(
        select(adminUsersSelectors.getAdminUserById(this.adminUserId)),
      ),
      this._store.pipe(select(roleContextsSelectors.getAllRoleContexts)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([adminUser, roleContexts]: [
          IAdminUser | undefined,
          IRoleContext[],
        ]): void => {
          if (adminUser) {
            this.adminUser = adminUser;
            const contextIds = (adminUser.roleContexts?.items || []).map(
              i => i.roleContextId,
            );

            this.roleContextOptions = roleContexts
              .filter(c => !contextIds.includes(c.id))
              .map(
                (roleContext): IKeyValue => ({
                  key: roleContext.id,
                  value: roleContext.name,
                }),
              );
          }
        },
      );
  }

  public removeRole(roleContext: IAdminUserConnectedRoleContext) {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.options = {
      message: 'roles.confirmRemoveRoleContext',
      buttons: [
        {
          label: 'common.ok',
          callback: async (): Promise<void> => {
            try {
              await this._amplifyDataService.delete('deleteAdminRoleContext', {
                id: roleContext.id,
              });

              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.updateSuccessful',
              );
            } catch (error) {
              console.error('there was an error sending the query', error);
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

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      try {
        await this._amplifyDataService.create('createAdminRoleContext', {
          ...this.dialogForm?.value,
          adminUserId: this.adminUser.id,
        });

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.insertSuccessful',
        );
        // this.close();
      } catch (error) {
        console.error('there was an error sending the query', error);
      }
    }
  }
}
