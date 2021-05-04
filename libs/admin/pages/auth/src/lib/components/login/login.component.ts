import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CognitoService } from '@bgap/admin/shared/data-access/auth';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public context = '';

  constructor(private _cognitoService: CognitoService) {}

  public contextChanged(context: string): void {
    this._cognitoService.currentContext = context;
  }
}
