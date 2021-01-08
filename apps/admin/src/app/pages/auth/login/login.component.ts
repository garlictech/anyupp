import { environment } from '../../../../environments/environment';

import { Component } from '@angular/core';

enum EFormMode {
  LOGIN = 'login',
  RESET = 'reset',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public env = environment;
  public formMode: EFormMode = EFormMode.LOGIN;
  public EFormMode = EFormMode;

  public toggleResetForm = ($event: any, showResetForm: boolean): void => {
    $event?.preventDefault();

    this.formMode = showResetForm ? EFormMode.RESET : EFormMode.LOGIN;
  };
}
