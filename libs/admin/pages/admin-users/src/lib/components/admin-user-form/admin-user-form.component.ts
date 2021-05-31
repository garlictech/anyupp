import { NGXLogger } from 'ngx-logger';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import {
  AnyuppSdkService,
  CrudSdkService,
} from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { contactFormGroup, EToasterType } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss'],
})
export class AdminUserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: CrudApi.AdminUser;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _logger: NGXLogger,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
    private _anyuppSdk: AnyuppSdkService,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(true),
      profileImage: [''], // Just for file upload!!
    });
  }

  get userImage(): string {
    return this.adminUser?.profileImage || '';
  }

  ngOnInit(): void {
    if (this.adminUser) {
      this.dialogForm.patchValue(cleanObject(this.adminUser));
    }

    this._changeDetectorRef.detectChanges();
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.adminUser?.id) {
        try {
          await this._crudSdk.sdk
            .UpdateAdminUser({
              input: {
                id: this.adminUser.id,
                ...this.dialogForm.value,
              },
            })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `ADMIN USER UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        try {
          const name = this.dialogForm.controls['name'].value;
          const email = this.dialogForm.controls['email'].value;
          const phone = this.dialogForm.controls['phone'].value;

          this._anyuppSdk.sdk
            .CreateAdminUser({
              input: { email, name, phone },
            })
            .subscribe(() => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.insertSuccessful',
              );

              this.close();
            });
        } catch (error) {
          this._logger.error(
            `ADMIN USER INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }

  public imageUploadCallback = async (image: string): Promise<void> => {
    this.dialogForm?.controls.profileImage.setValue(image);

    if (this.adminUser?.id) {
      try {
        await this._crudSdk.sdk
          .UpdateAdminUser({
            input: {
              id: this.adminUser.id,
              profileImage: image,
            },
          })
          .toPromise();

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageUploadSuccess',
        );
      } catch (error) {
        this._logger.error(
          `ADMIN USER IMAGE UPLOAD ERROR: ${JSON.stringify(error)}`,
        );
      }
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }
  };

  public imageRemoveCallback = async (): Promise<void> => {
    this.dialogForm?.controls.profileImage.setValue('');

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

    if (this.adminUser?.id) {
      try {
        await this._crudSdk.sdk
          .UpdateAdminUser({
            input: {
              id: this.adminUser.id,
              profileImage: null,
            },
          })
          .toPromise();

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageRemoveSuccess',
        );
      } catch (error) {
        this._logger.error(
          `ADMIN USER IMAGE REMOVE ERROR: ${JSON.stringify(error)}`,
        );
      }
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }

    this._changeDetectorRef.detectChanges();
  };
}
