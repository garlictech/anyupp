import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { clearDbProperties, EToasterType, amplifyObjectUpdater } from '@bgap/admin/shared/utils';
import { AdminUser } from '@bgap/api/graphql/schema';
import { IAdminUser } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

@Component({
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
  styleUrls: ['./admin-user-role-form.component.scss'],
})
export class AdminUserRoleFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: IAdminUser;
  private _amplifyDataService: AmplifyDataService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyDataService = this._injector.get(AmplifyDataService);
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

    this.dialogForm.patchValue(clearDbProperties<IAdminUser>(this.adminUser));
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      try {
        this._amplifyDataService.update(
          AdminUser,
          this.adminUser?.id || '',
          amplifyObjectUpdater({
            roles: cleanObject(this.dialogForm?.value.roles)
          }),
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
