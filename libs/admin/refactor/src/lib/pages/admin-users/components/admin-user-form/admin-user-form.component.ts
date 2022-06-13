import { cloneDeep } from 'lodash/fp';
import { switchMap, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { AdminUser } from '@bgap/domain';
import { EImageType, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { AdminUserFormService } from '../../services/admin-user-form.service';

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
  public adminUser!: AdminUser;
  public eImageType = EImageType;

  constructor(
    protected override _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _adminUserFormService: AdminUserFormService,
  ) {
    super(_injector);

    this.dialogForm = this._adminUserFormService.createAdminUserFormGroup();
  }

  get userImage(): string {
    return this.adminUser?.profileImage || '';
  }

  ngOnInit() {
    if (this.adminUser) {
      this.dialogForm?.patchValue(cleanObject(this.adminUser));
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._adminUserFormService.saveForm$(
              cloneDeep(this.dialogForm?.value),
              this.adminUser?.id,
            ),
          ),
          tap(() => this.setWorking$(false)),
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }

  public imageUploadCallback = (image: string) => {
    this.dialogForm?.controls['profileImage'].setValue(image);

    if (this.adminUser?.id) {
      this._adminUserFormService
        .updateAdminUser$({
          id: this.adminUser.id,
          profileImage: image,
        })
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls['profileImage'].setValue('');

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

    this._changeDetectorRef.detectChanges();

    if (this.adminUser?.id) {
      this._adminUserFormService
        .updateAdminUser$({
          id: this.adminUser.id,
          profileImage: null,
        })
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageRemove');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
}
