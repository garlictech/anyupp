import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { clearDbProperties, EToasterType } from '@bgap/admin/shared/utils';
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
  private _amplifyDataService: AmplifyDataService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyDataService = this._injector.get(AmplifyDataService);
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      roleContext: this._formBuilder.group({
        role: ['', [Validators.required]],
        entities: [[]],
      }),
    });

    this.dialogForm.patchValue(clearDbProperties<IAdminUser>(this.adminUser));
  }

  public async submit(): Promise<void> {
    /*
    if (this.dialogForm?.valid) {
      try {
        await this._amplifyDataService.update<IAdminUserRole>(
          'getAdminUser',
          'updateAdminUser',
          this.adminUser.id || '',
          () => this.dialogForm.value,
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
    */
  }
}
