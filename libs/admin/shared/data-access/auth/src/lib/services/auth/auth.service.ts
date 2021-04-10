import { Injectable } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';

import { CognitoService } from '../cognito/cognito.service';
import { take } from 'rxjs/operators';
import { IAuthenticatedCognitoUser } from '@bgap/shared/types';

import { onAuthUIStateChange } from '@aws-amplify/ui-components';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _dataService: DataService,
    private _cognitoService: CognitoService,
  ) {}

  public init() {
    // TODO: we replaced aws-amplify-angular with @aws-amplify/ui-components
    // so the method below can probably be simplified. See the corresponding
    // callback in app.component.ts, where we get the user data as well.
    onAuthUIStateChange(authState => {
      if (authState === 'signedin') {
        this._cognitoService
          .getAuth()
          .pipe(take(1))
          .subscribe((cognitoUser: IAuthenticatedCognitoUser | undefined) => {
            this._dataService.initDataConnections(cognitoUser?.user?.id || '');
          });
      } else {
        this._dataService.destroyDataConnection();
      }
    });

    this._cognitoService.onSignOut(() => {
      this._dataService.destroyDataConnection();
    });
  }

  public async signOut(): Promise<void> {
    this._cognitoService.signOut();
  }
}
