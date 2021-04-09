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
    // TODO get the desired context from the UI and specify it here
    // The system will try to authorize. If it is unsuccessful, the user still
    // logs in, however, there will be no context info in the token, so he should
    // be unable to do any operations requiring authorization.
    this._cognitoService.currentContext = 'FOOBAR';
    this._cognitoService.signIn();
  }
}
