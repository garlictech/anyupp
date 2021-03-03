import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent, FormsService } from '@bgap/admin/shared/forms';
import { contactFormGroup, EToasterType } from '@bgap/admin/shared/utils';
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

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formService = this._injector.get(FormsService);
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
      this.dialogForm.patchValue(this.adminUser);
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
            (updated: any) => {
              const updateObj = cleanObject(this.dialogForm?.value);

              Object.keys(updateObj).forEach(k => {
                updated[k] = updateObj[k];
              });
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
      } else {
        try {
          this._amplifyDataService.create(AdminUser, {
            ...(<any>cleanObject(this.dialogForm?.value)),
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
          console.error('there was an error sending the query', error);
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
