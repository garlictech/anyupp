import { GetAdminUser } from '@bgap/api/graphql/schema';
import { get as _get } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { GraphqlClientService } from '@bgap/admin/shared/data-access/graphql-client';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import { EAdminRole, IAdminUser, IAuthenticatedCognitoUser } from '@bgap/shared/types';
import { CognitoService } from '../cognito/cognito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _toasterService: ToasterService,
    private _router: Router,
    private _cognitoService: CognitoService,
    private _graphqlClientService: GraphqlClientService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._getAdminUser().pipe(
      map((adminUser: IAdminUser | undefined) => {
        if (!adminUser) {
          this._router.navigate(['auth/login']);

          this._toasterService.show(EToasterType.DANGER, '', 'auth.authFailed');
        }

        return true;
      })
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot
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
      })
    );
  }

  private _getAdminUser(): Observable<IAdminUser | undefined>  {
    return of('guard').pipe(
      switchMap(
        (): Observable<IAuthenticatedCognitoUser | undefined> =>
          this._cognitoService.getAuth()
      ),
      switchMap(
        (cognitoUser): Observable<IAdminUser | undefined> => {
          return cognitoUser ? this._graphqlClientService.adminClient
            .query(GetAdminUser, {
              id: cognitoUser?.user?.id,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .pipe(map((data: any) => data?.data?.getAdminUser || undefined)) : of(undefined);
        }
      ),
      take(1)
    );
  }
}
