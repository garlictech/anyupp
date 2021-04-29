import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  clearDbProperties,
  contactFormGroup,
  EToasterType,
} from '@bgap/admin/shared/utils';
import { AnyuppApi } from '@bgap/anyupp-gql/api';
import {
  anyuppAuthenticatedGraphqlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { EImageType, IAdminUser } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss'],
})
export class AdminUserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser!: IAdminUser;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _logger: NGXLogger,
    private _amplifyDataService: AmplifyDataService,
    private _changeDetectorRef: ChangeDetectorRef,
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
      this.dialogForm.patchValue(clearDbProperties<IAdminUser>(this.adminUser));
    }

    this._changeDetectorRef.detectChanges();
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.adminUser?.id) {
        try {
          await this._amplifyDataService.update<IAdminUser>(
            'getAdminUser',
            'updateAdminUser',
            this.adminUser.id,
            () => this.dialogForm.value,
          );

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

          executeMutation(
            anyuppAuthenticatedGraphqlClient,
          )(AnyuppApi.CreateAdminUser, { input: { email, name, phone } })
            .pipe(map((result: any) => result.createAdminUser))
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
        await this._amplifyDataService.update<IAdminUser>(
          'getAdminUser',
          'updateAdminUser',
          this.adminUser.id,
          (data: unknown) => fp.set(`profileImage`, image, <IAdminUser>data),
        );

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
        await this._amplifyDataService.update<IAdminUser>(
          'getAdminUser',
          'updateAdminUser',
          this.adminUser.id,
          (data: unknown) => fp.set(`profileImage`, null, <IAdminUser>data),
        );

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
