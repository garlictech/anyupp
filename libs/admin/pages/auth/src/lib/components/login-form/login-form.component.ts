import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@bgap/admin/shared/data-access/auth';

@Component({
  selector: 'bgap-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() toggleResetForm!: ($event: Event, showResetForm: boolean) => {};
  public loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      this._authService.signIn(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    }
  }
}
