import { get as _get } from 'lodash-es';

import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { EAdminRole, EImageType, IAdminUser, IUser } from '@bgap/shared/types';

import { AbstractFormDialogComponent } from '../../../../shared/modules/shared-forms/components/abstract-form-dialog';
import { contactFormGroup } from '../../../../shared/pure';
import { AuthService } from '../../../../shared/services/auth';
import { FormsService } from '../../../../shared/services/forms';
import { EToasterType } from '../../../../shared/services/toaster';

@Component({
  selector: 'bgap-admin-user-form',
  templateUrl: './admin-user-form.component.html',
})
export class AdminUserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public adminUser: IAdminUser;
  public eImageType = EImageType;
  private _authService: AuthService;
  private _formService: FormsService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._authService = this._injector.get(AuthService);
    this._formService = this._injector.get(FormsService);
  }

  get userImage(): string {
    return _get(this.adminUser, 'profileImage');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(this._formBuilder),
      profileImage: [''], // Just for file upload!!
    });

    // Add custom asyncValidator to check existing email
    this.dialogForm.controls['email'].setAsyncValidators([
      this._formService.adminExistingEmailValidator,
    ]);

    if (this.adminUser) {
      this.dialogForm.patchValue(this.adminUser);
    }
  }

  public async submit(): Promise<void> {
    if (this.dialogForm.valid) {
      if (_get(this.adminUser, '_id')) {
        this._dataService
          .updateAdminUser(this.adminUser._id, this.dialogForm.value)
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
      } else {
        // Find existing global admin account (not from stage-dependent adminCredentials)
        const adminUsersByEmail: IAdminUser[] = await this._dataService.getAdminUserByEmail(
          this.dialogForm.value.email
        );
        const usersByEmail: IUser[] = await this._dataService.getUserByEmail(
          this.dialogForm.value.email
        );
        const existingUser = adminUsersByEmail[0] || usersByEmail[0];

        if (!existingUser) {
          // The admin is absolutely new, so we create a new account
          this._authService
            .createUserWithEmailAndRandomPassword(this.dialogForm.value.email)
            .then(
              (credential: firebase.auth.UserCredential): void => {
                this._saveAdminUser(credential.user.uid);
              },
              (err) => {
                console.error('AUTH USER CRATE ERROR', err);
              }
            );
        } else if (adminUsersByEmail[0]) {
          // Admin user exist, so we have to create a credential on the current stage
          // The email field validator filters the existing admins from the current stage
          this._dataService
            .updateAdminUserRoles(adminUsersByEmail[0]._id, {
              entities: [],
              role: EAdminRole.INACTIVE,
            })
            .then((): void => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.insertSuccessful'
              );
              this.close();
            });
        } else if (usersByEmail[0]) {
          // Customer user exists (registered on the app)
          // Now we create an admin from the given UID
          this._saveAdminUser(usersByEmail[0]._id);
        }
      }
    }
  }

  private _saveAdminUser(uid: string): void {
    // Now we use the update method to insert admin user with the created uid
    this._dataService.updateAdminUser(uid, this.dialogForm.value).then(
      (): void => {
        this._dataService
          .updateAdminUserRoles(uid, {
            entities: [],
            role: EAdminRole.INACTIVE,
          })
          .then(
            (): void => {
              this._authService
                .sendPasswordResetEmail(this.dialogForm.value.email)
                .then(
                  (): void => {
                    this._toasterService.show(
                      EToasterType.SUCCESS,
                      '',
                      'common.insertSuccessful'
                    );
                    this.close();
                  },
                  (err) => {
                    console.error('PASSW RESET ERROR', err);
                  }
                );
            },
            (err) => {
              console.error('USER UPDATE ROLE ERROR', err);
            }
          );
      },
      (err) => {
        console.error('USER UPDATE ERROR', err);
      }
    );
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

    if (this.adminUser) {
      delete this.adminUser.profileImage;
    }

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
