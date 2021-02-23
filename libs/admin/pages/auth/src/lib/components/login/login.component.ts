import { Component } from '@angular/core';
import { environment } from '@bgap/admin/shared/config';
import { CognitoService } from '@bgap/admin/shared/data-access/auth';

@Component({
  selector: 'bgap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public env = environment;

  constructor(private _cognitoService: CognitoService) {}

  public openLoginUI(): void {
    this._cognitoService.signIn();
  }
}
