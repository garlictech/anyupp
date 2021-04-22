import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';

import { CognitoService } from '../cognito/cognito.service';
import { map } from 'rxjs/operators';
import { EAdminRole } from 'libs/shared/types/src';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    private _cognitoService: CognitoService,
  ) {}

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
