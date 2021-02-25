import { GraphQLService } from '@bgap/admin/shared/data-access/data';
import { get as _get } from 'lodash-es';

import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '@bgap/admin/shared/forms';
import { contactFormGroup, EToasterType } from '@bgap/admin/shared/utils';
import { cleanObject } from '@bgap/shared/utils';
import { EImageType, IAdminUser } from '@bgap/shared/types';

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
  private _graphQLService: GraphQLService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formService = this._injector.get(FormsService);
    this._graphQLService = this._injector.get(GraphQLService);
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
      if (this.adminUser?._id) {
        this._graphQLService
          .updateAdminUser(
            this.adminUser._id,
            cleanObject(this.dialogForm?.value),
          )
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
      } else {
        this._graphQLService
          .createAdminUser(cleanObject(this.dialogForm?.value))
          .subscribe(
            () => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.insertSuccessful',
              );
              this.close();
            },
            error => {
              console.error('there was an error sending the query', error);
            },
          );
      }
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

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

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
