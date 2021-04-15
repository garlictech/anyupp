import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { awsConfig } from '@bgap/crud-gql/api';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { clearDbProperties, contactFormGroup, EToasterType } from '@bgap/admin/shared/utils';
import { AppsyncApi } from '@bgap/anyupp-gql/backend';
import { config } from '@bgap/shared/config';
import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { EImageType, IAdminUser } from '@bgap/shared/types';
import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';


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

  constructor(
    protected _injector: Injector,
    private _logger: NGXLogger,
    private _amplifyDataService: AmplifyDataService,
  ) {
    super(_injector);
  }

  get userImage(): string {
    return this.adminUser?.profileImage || '';
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(true),
      profileImage: [''], // Just for file upload!!
    });

    if (this.adminUser) {
      this.dialogForm.patchValue(clearDbProperties<IAdminUser>(this.adminUser));
    }
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

          const { GraphqlApiKey, GraphqlApiUrl } = config;
          const appsyncConfig = {
            ...awsConfig,
            aws_appsync_graphqlEndpoint: GraphqlApiUrl,
            aws_appsync_apiKey: GraphqlApiKey,
          };
          const appsyncApiClient = GraphqlApiFp.createAuthenticatedClient(
            appsyncConfig,
            console,
            true,
          );

          appsyncApiClient
            .mutate(AppsyncApi.CreateAdminUser, {
              input: { email, name, phone },
            })
            .pipe(map((result: any) => result.data.createAdminUser))
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
  };
}
