import { DataService } from '@bgap/admin/shared/data-access/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
} from '@angular/router';
import { EAdminRole, IAuthenticatedCognitoUser } from '@bgap/shared/types';

import { CognitoService } from '../cognito/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    private _cognitoService: CognitoService,
    private _dataService: DataService,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._cognitoService.getAuth().pipe(
      map((cognitoUser: IAuthenticatedCognitoUser | undefined) => {
        if (!cognitoUser) {
          this._dataService.destroyDataConnection();
          this._router.navigate(['auth/login']);
        } else {
          this._dataService.initDataConnections(
            cognitoUser?.user?.id || '',
            <EAdminRole>cognitoUser?.user?.role || EAdminRole.INACTIVE,
          );
        }

        return true;
      }),
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._cognitoService.getAuth().pipe(
      map((cognitoUser): boolean => {
        if (cognitoUser?.user?.role === EAdminRole.INACTIVE) {
          this._cognitoService.signOut();
          this._router.navigate(['auth/login']);
        } else {
          const adminRole: EAdminRole =
            <EAdminRole>cognitoUser?.user?.role || EAdminRole.INACTIVE;
          const routeRoles: EAdminRole[] = next?.data?.roles || [];

          if (!routeRoles.includes(adminRole)) {
            this._router.navigate(['admin/dashboard']);
          }
        }

        return true;
      }),
    );
  }
}
