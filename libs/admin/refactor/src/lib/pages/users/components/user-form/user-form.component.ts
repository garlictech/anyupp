import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { User } from '@bgap/domain';

import { AbstractFormDialogComponent } from '../../../../shared/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent extends AbstractFormDialogComponent {
  public user: User | undefined;

  constructor(protected override _injector: Injector) {
    super(_injector);
  }

  get userImage(): string {
    return this.user?.profileImage || '';
  }

  public submit() {
    /*
    if (this.dialogForm?.valid) {
      if (this.user?.id) {
        this._dataService.updateUser(this.user.id, this.dialogForm?.value).then(
          () => {
            this._toasterService.showSimpleSuccess('update');
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
            () => {
              this._dataService.insertUser(this.dialogForm?.value).then(
                () => {
                  this._authService
                    .sendPasswordResetEmail(this.dialogForm?.value.email)
                    .then(
                      () => {
                        this._toasterService.showSimpleSuccess('insert');
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
  public imageUploadCallback = (imagePath: string) => {
    this.dialogForm.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, imagePath).then(() => {
        this._toasterService.showSimpleSuccess('imageUpload');
      });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm.controls.profileImage.setValue('');
    delete this.user.profileImage;

    // Update existing user's image
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, null).then(() => {
        this._toasterService.showSimpleSuccess( 'imageRemove');
      });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
  */
}
