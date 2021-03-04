import { get as _get } from 'lodash-es';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { DataStore } from '@aws-amplify/datastore';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import { AdminUser } from '@bgap/api/graphql/schema';
import {
  EAdminRole,
  IAdminUser,
  IAuthenticatedCognitoUser,
} from '@bgap/shared/types';

import { CognitoService } from '../cognito/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _toasterService: ToasterService,
    private _router: Router,
    private _cognitoService: CognitoService,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._getAdminUser().pipe(
      map((adminUser: IAdminUser | undefined) => {
        if (!adminUser) {
          this._router.navigate(['auth/login']);

          this._toasterService.show(EToasterType.DANGER, '', 'auth.authFailed');
        }

        return true;
      }),
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._getAdminUser().pipe(
      map((adminUser: IAdminUser | undefined) => {
        if (_get(adminUser, 'roles.role') === EAdminRole.INACTIVE) {
          this._cognitoService.signOut();
          this._router.navigate(['auth/login']);
        } else {
          const adminRole: EAdminRole = _get(adminUser, 'roles.role', '');
          const routeRoles: EAdminRole[] = _get(next, 'data.roles', []);

          if (!routeRoles.includes(adminRole)) {
            this._router.navigate(['admin/dashboard']);
          }
        }

        return true;
      }),
    );
  }

  private _getAdminUser(): Observable<IAdminUser | undefined> {
    return of('guard').pipe(
      switchMap(
        (): Observable<IAuthenticatedCognitoUser | undefined> =>
          this._cognitoService.getAuth(),
      ),
      switchMap(
        (cognitoUser): Observable<IAdminUser | undefined> => {
          return cognitoUser
            ? from(
                DataStore.query(AdminUser, <string>cognitoUser?.user?.id),
              ).pipe(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                map((data: any) => {
                  return data || undefined;
                }),
              )
            : of(undefined);
        },
      ),
      take(1),
    );
  }
}
