import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public user: CrudApi.User | undefined;

  constructor(protected _injector: Injector) {
    super(_injector);
  }

  get userImage(): string {
    return this.user?.profileImage || '';
  }

  ngOnInit() {
    /*
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(),
      profileImage: [''], // Just for file upload!!
    });

    if (this.user) {
      this.dialogForm.patchValue(this.user);
    }

    this._changeDetectorRef.detectChanges();
    */
  }

  public submit(): void {
    /*
    if (this.dialogForm?.valid) {
      if (this.user?.id) {
        this._dataService.updateUser(this.user.id, this.dialogForm?.value).then(
          (): void => {
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
            (): void => {
              this._dataService.insertUser(this.dialogForm?.value).then(
                (): void => {
                  this._authService
                    .sendPasswordResetEmail(this.dialogForm?.value.email)
                    .then(
                      (): void => {
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
  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.profileImage.setValue(imagePath);

    // Update existing user's image
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, imagePath).then((): void => {
        this._toasterService.showSimpleSuccess('imageUpload');
      });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm.controls.profileImage.setValue('');
    delete this.user.profileImage;

    // Update existing user's image
    if (this.user?.id) {
      this._dataService.updateUserProfileImagePath(this.user.id, null).then((): void => {
        this._toasterService.showSimpleSuccess( 'imageRemove');
      });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
  */
}
