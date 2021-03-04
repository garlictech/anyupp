import { NGXLogger } from 'ngx-logger';

import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Auth } from '@aws-amplify/auth';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent, FormsService } from '@bgap/admin/shared/forms';
import { clearDbProperties, contactFormGroup, EToasterType, amplifyObjectUpdater } from '@bgap/admin/shared/utils';
import { AdminUser } from '@bgap/api/graphql/schema';
import { EAdminRole, EImageType, IAdminUser } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

@Component({
  selector: 'bgap-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss'],
})
export class AdminUserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: IAdminUser;
  public eImageType = EImageType;

  private _formService: FormsService;
  private _amplifyDataService: AmplifyDataService;
  private _logger: NGXLogger;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formService = this._injector.get(FormsService);
    this._logger = this._injector.get(NGXLogger);
    this._amplifyDataService = this._injector.get(AmplifyDataService);
  }

  get userImage(): string {
    return this.adminUser?.profileImage || '';
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(this._formBuilder),
      profileImage: [''], // Just for file upload!!
    });

    if (this.adminUser) {
      this.dialogForm.patchValue(clearDbProperties<IAdminUser>(this.adminUser));
    } else {
      // Add custom asyncValidator to check existing email
      (<FormControl>this.dialogForm.controls.email).setAsyncValidators([
        this._formService.adminExistingEmailValidator(
          this.dialogForm.controls.email || '',
        ),
      ]);
    }
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.adminUser?.id) {
        try {
          this._amplifyDataService.update(
            AdminUser,
            this.adminUser?.id || '',
            amplifyObjectUpdater(this.dialogForm?.value),
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(`ADMIN USER UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          const email = this.dialogForm.controls['email'].value;
          const user = await Auth.signUp({
            username: email,
            password: 'tempAdfd12TODO',
            attributes: {
              email
            }
          });

          this._amplifyDataService.create(AdminUser, {
            ...(cleanObject(this.dialogForm?.value)),
            id: user.userSub,
            roles: {
              role: EAdminRole.INACTIVE,
            },
          });

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(`ADMIN USER INSERT ERROR: ${JSON.stringify(error)}`);
        }
      }
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm?.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (this.adminUser?.id) {
      console.error('TODO implement AWS');
      /*
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser.id || '', imagePath)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess',
          );
        });
        */
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm?.controls.profileImage.setValue('');

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

    // Update existing user's image
    if (this.adminUser?.id) {
      console.error('TODO implement AWS');
      /*
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser.id || '', null)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess',
          );
        });
      */
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };
}
