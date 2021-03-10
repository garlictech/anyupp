import { from, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { API, GraphQLResult } from '@aws-amplify/api';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import { GetAdminUserQuery, Queries } from '@bgap/admin/amplify-api';
import {
  EAdminRole,
  IAdminUser,
  IAuthenticatedCognitoUser,
} from '@bgap/shared/types';

import { CognitoService } from '../cognito/cognito.service';

interface IAuthAdminResult {
  data?: {
    getAdminUser?: IAdminUser;
  };
}

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
        if (adminUser?.roles?.role === EAdminRole.INACTIVE) {
          this._cognitoService.signOut();
          this._router.navigate(['auth/login']);
        } else {
          const adminRole: EAdminRole =
            adminUser?.roles?.role || EAdminRole.INACTIVE;
          const routeRoles: EAdminRole[] = next?.data?.roles || [];

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
        (cognitoUser): Observable<IAdminUser | undefined> =>
          cognitoUser
            ? from(
                <Promise<GraphQLResult<GetAdminUserQuery>>>API.graphql({
                  query: Queries.getAdminUser,
                  variables: { id: <string>cognitoUser?.user?.id },
                }),
              ).pipe(map(data => (<IAuthAdminResult>data).data?.getAdminUser))
            : of(undefined),
      ),
      take(1),
    );
  }
}
