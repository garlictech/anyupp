import { Component } from '@angular/core';
import { environment } from '@bgap/admin/shared/config';

enum EFormMode {
  LOGIN = 'login',
  RESET = 'reset',
}

@Component({
  selector: 'bgap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public env = environment;
  public formMode: EFormMode = EFormMode.LOGIN;
  public EFormMode = EFormMode;

  public toggleResetForm = ($event: Event, showResetForm: boolean): void => {
    $event?.preventDefault();

    this.formMode = showResetForm ? EFormMode.RESET : EFormMode.LOGIN;
  };
}

