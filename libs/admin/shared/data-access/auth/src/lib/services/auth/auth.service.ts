import { AmplifyService } from 'aws-amplify-angular';
import { AuthState } from 'aws-amplify-angular/dist/src/providers';

import { Injectable } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';

import { CognitoService } from '../cognito/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _dataService: DataService,
    private _cognitoService: CognitoService,
    private _amplifyService: AmplifyService,
  ) {

    this._amplifyService.authStateChange$.subscribe((authState: AuthState) => {
      if (authState.user) {
        this._dataService.initDataConnections(/*authState.user.username*/);
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
