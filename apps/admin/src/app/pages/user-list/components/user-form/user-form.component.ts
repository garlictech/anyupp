import { get as _get } from 'lodash-es';
import { IUser } from '../../../../shared/interfaces';
import { AbstractFormDialogComponent } from '../../../../shared/modules/shared-forms/components/abstract-form-dialog/abstract-form-dialog.component';
import { contactFormGroup } from '../../../../shared/pure';
import { AuthService } from '../../../../shared/services/auth';
import { EToasterType } from '../../../../shared/services/toaster';

import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public user: IUser;

  private _authService: AuthService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._authService = this._injector.get(AuthService);
  }

  get userImage(): string {
    return _get(this.user, 'profileImage');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(this._formBuilder),
      profileImage: [''], // Just for file upload!!
    });

    if (this.user) {
      this.dialogForm.patchValue(this.user);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      if (_get(this.user, '_id')) {
        this._dataService.updateUser(this.user._id, this.dialogForm.value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          (err): any => {
            console.error('USER UPDATE ERROR', err);
          }
        );
      } else {
        this._authService
          .createUserWithEmailAndRandomPassword(this.dialogForm.value.email)
          .then(
            (): void => {
              this._dataService.insertUser(this.dialogForm.value).then(
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
                      (err): any => {
                        console.error('PASSW RESET ERROR', err);
                      }
                    );
                },
                (err): any => {
                  console.error('USER INSERT ERROR', err);
                }
              );
            },
            (err): any => {
              console.error('AUTH USER CRATE ERROR', err);
            }
          );
      }
    }
  }

  /*
  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (_get(this.user, '_id')) {
      this._dataService.updateUserProfileImagePath(this.user._id, imagePath).then((): void => {
        this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageUploadSuccess');
      });
    } else {
      this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageUploadSuccess');
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm.controls.profileImage.setValue('');
    delete this.user.profileImage;

    // Update existing user's image
    if (_get(this.user, '_id')) {
      this._dataService.updateUserProfileImagePath(this.user._id, null).then((): void => {
        this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
      });
    } else {
      this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
    }
  };
  */
}
