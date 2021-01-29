import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@bgap/admin/shared/auth';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';

@Component({
  selector: 'bgap-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss'],
})
export class PasswordResetFormComponent {
  @Input() toggleResetForm;
  public resetForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _toasterService: ToasterService
  ) {
    this.resetForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public resetPassword(): void {
    if (this.resetForm.valid) {
      this._authService.sendPasswordResetEmail(this.resetForm.value.email).then(
        (): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'auth.reminderSent'
          );
          this.toggleResetForm(null, false);
        },
        (): void => {
          this._toasterService.show(
            EToasterType.DANGER,
            '',
            'auth.reminderError'
          );
        }
      );
    }
  }
}
