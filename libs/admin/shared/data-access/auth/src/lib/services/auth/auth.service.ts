import { AmplifyService } from 'aws-amplify-angular';
import { AuthState } from 'aws-amplify-angular/dist/src/providers';

import { Injectable } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';

import { CognitoService } from '../cognito/cognito.service';
import { take } from 'rxjs/operators';
import { IAuthenticatedCognitoUser } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _dataService: DataService,
    private _cognitoService: CognitoService,
    private _amplifyService: AmplifyService,
  ) {}

  public init() {
    this._amplifyService.authStateChange$.subscribe((authState: AuthState) => {
      if (authState.state === 'signedIn') {
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
