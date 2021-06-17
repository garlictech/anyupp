import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { contactFormGroup } from '@bgap/admin/shared/utils';
import { IUser } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public user: IUser | undefined;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);
  }

  get userImage(): string {
    return this.user?.profileImage || '';
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(),
      profileImage: [''], // Just for file upload!!
    });

    if (this.user) {
      this.dialogForm.patchValue(this.user);
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit(): void {
    /*
    if (this.dialogForm?.valid) {
      if (this.user?.id) {
        this._dataService.updateUser(this.user.id, this.dialogForm?.value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          err => {
            console.error('USER UPDATE ERROR', err);
          }
        );
      } else {
        this._authService
          .createUserWithEmailAndRandomPassword(this.dialogForm?.value.email)
          .then(
            (): void => {
              this._dataService.insertUser(this.dialogForm?.value).then(
                (): void => {
                  this._authService
                    .sendPasswordResetEmail(this.dialogForm?.value.email)
                    .then(
                      (): void => {
                        this._toasterService.show(
                          EToasterType.SUCCESS,
                          '',
                          'common.insertSuccessful'
                        );
                        this.close();
                      },
                      err => {
                        console.error('PASSW RESET ERROR', err);
                      }
                    );
                },
                err => {
                  console.error('USER INSERT ERROR', err);
                }
              );
            },
            err => {
              console.error('AUTH USER CRATE ERROR', err);
            }
          );
      }
    }
    */
  }

  /*
  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, imagePath).then((): void => {
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
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, null).then((): void => {
        this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
      });
    } else {
      this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
    }
  };
  */
}
