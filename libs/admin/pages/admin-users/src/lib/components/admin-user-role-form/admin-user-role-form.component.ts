import { Apollo } from 'apollo-angular';
import { get as _get } from 'lodash-es';

import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { EToasterType } from '@bgap/admin/shared/utils';
import { cleanObject } from '@bgap/shared/utils';
import { UpdateAdminUserRole } from '@bgap/api/graphql/schema';
import { IAdminUser } from '@bgap/shared/types';

@Component({
  selector: 'bgap-admin-user-role-form',
  templateUrl: './admin-user-role-form.component.html',
  styleUrls: ['./admin-user-role-form.component.scss'],
})
export class AdminUserRoleFormComponent extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: IAdminUser;
  private _apollo: Apollo;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._apollo = this._injector.get(Apollo);
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

  public submit(): void {
    if (this.dialogForm?.valid) {
      this._apollo
        .mutate({
          mutation: UpdateAdminUserRole,
          variables: {
            data: cleanObject(this.dialogForm?.value.roles),
            id: this.adminUser._id,
          },
        })
        .subscribe(
          () => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful',
            );
            this.close();
          },
          error => {
            console.error('there was an error sending the query', error);
          },
        );
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm?.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (_get(this.adminUser, '_id')) {
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser._id || '', imagePath)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess',
          );
        });
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
    delete this.adminUser.profileImage;

    // Update existing user's image
    if (_get(this.adminUser, '_id')) {
      this._dataService
        .updateAdminUserProfileImagePath(this.adminUser._id || '', null)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess',
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };
}
