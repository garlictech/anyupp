import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
} from '@angular/router';
import { DataService } from '@bgap/admin/shared/data-access/data';
import * as CrudApi from '@bgap/crud-gql/api';
import { AuthenticatedCognitoUser } from '@bgap/shared/types';

import { CognitoService } from '../cognito/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    private _ngZone: NgZone,
    private _cognitoService: CognitoService,
    private _dataService: DataService,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._cognitoService.getAuth().pipe(
      map((cognitoUser: AuthenticatedCognitoUser | undefined) => {
        if (!cognitoUser) {
          this._dataService.destroyDataConnection();
          this._ngZone.run(() => {
            this._router.navigate(['auth/login']);
          });
        } else {
          this._dataService.initDataConnections(
            cognitoUser?.user?.id || '',
            CrudApi.Role.superuser,
          );
        }

        return true;
      }),
    );
  }

  canActivateChild(
    _next: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._cognitoService.getAuth().pipe(
      map((cognitoUser): boolean => {
        if (cognitoUser?.user) {
          this._ngZone.run(() => {
            this._router.navigate(['admin/dashboard']);
          });
        }

        return true;
      }),
    );
  }
}
