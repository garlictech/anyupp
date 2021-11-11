import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { contactFormGroup } from '@bgap/admin/shared/utils';
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
  implements OnInit
{
  public adminUser!: CrudApi.AdminUser;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
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

  public submit() {
    if (this.dialogForm?.valid) {
      if (this.adminUser?.id) {
        this._crudSdk.sdk
          .UpdateAdminUser({
            input: {
              id: this.adminUser.id,
              ...this.dialogForm.value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.updateSuccessful');

            this.close();
          });
      } else {
        const name = this.dialogForm.controls['name'].value;
        const email = this.dialogForm.controls['email'].value;
        const phone = this.dialogForm.controls['phone'].value;

        this._crudSdk.sdk
          .CreateAdminUser({
            input: { email, name, phone },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.insertSuccessful');

            this.close();
          });
      }
    }
  }

  public imageUploadCallback = (image: string) => {
    this.dialogForm?.controls.profileImage.setValue(image);

    if (this.adminUser?.id) {
      this._crudSdk.sdk
        .UpdateAdminUser({
          input: {
            id: this.adminUser.id,
            profileImage: image,
          },
        })
        .pipe(catchGqlError(this._store))
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
        });
    } else {
      this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls.profileImage.setValue('');

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

    if (this.adminUser?.id) {
      this._crudSdk.sdk
        .UpdateAdminUser({
          input: {
            id: this.adminUser.id,
            profileImage: null,
          },
        })
        .pipe(catchGqlError(this._store))
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
        });
    } else {
      this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
    }

    this._changeDetectorRef.detectChanges();
  };
}
