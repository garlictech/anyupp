import { EToasterType } from 'libs/admin/shared/utils/src';
import { AdminUser } from 'libs/api/graphql/schema/src';
import { cleanObject } from 'libs/shared/utils/src';

import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AmplifyService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { IAdminUser } from '@bgap/shared/types';

@Component({
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
  styleUrls: ['./admin-user-role-form.component.scss'],
})
export class AdminUserRoleFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: IAdminUser;
  private _amplifyService: AmplifyService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyService = this._injector.get(AmplifyService);
  }

  get userImage(): string | undefined {
    return this.adminUser?.profileImage || '';
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      roles: this._formBuilder.group({
        role: ['', [Validators.required]],
        entities: [[]],
      }),
    });

    this.dialogForm.patchValue(this.adminUser);
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      try {
        this._amplifyService.update(
          AdminUser,
          this.adminUser?.id || '',
          (updated: any) => {
            updated.roles = cleanObject(this.dialogForm?.value.roles);
          },
        );

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.updateSuccessful',
        );
        this.close();
      } catch (error) {
        console.error('there was an error sending the query', error);
      }
    }
  }
}
