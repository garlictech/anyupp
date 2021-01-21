import { get as _get } from 'lodash-es';
import { IAdminUser } from '@bgap/shared/types/interfaces';
import { AbstractFormDialogComponent } from '../../../../shared/modules/shared-forms/components/abstract-form-dialog';
import { EToasterType } from '../../../../shared/services/toaster';

import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
})
export class AdminUserRoleFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser: IAdminUser;

  constructor(protected _injector: Injector) {
    super(_injector);
  }

  get userImage(): string {
    return _get(this.adminUser, 'profileImage');
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

  public submit(): void {
    if (this.dialogForm.valid) {
      this._dataService
        .updateAdminUserRoles(this.adminUser._id, this.dialogForm.value.roles)
        .then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          (err) => {
            console.error('USER UPDATE ERROR', err);
          }
        );
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (_get(this.adminUser, '_id')) {
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser._id, imagePath)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess'
      );
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm.controls.profileImage.setValue('');
    delete this.adminUser.profileImage;

    // Update existing user's image
    if (_get(this.adminUser, '_id')) {
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser._id, null)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess'
      );
    }
  };
}
