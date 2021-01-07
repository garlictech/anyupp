import { get as _get } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { EAdminRole } from '../../enums';
import { IAdminUser } from '../../interfaces';
import { EToasterType, ToasterService } from '../toaster';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _toasterService: ToasterService,
    private _router: Router,
    private _angularFireDatabase: AngularFireDatabase,
    private _angularFireAuth: AngularFireAuth
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return of('guard').pipe(
      switchMap((): Observable<firebase.User> => this._angularFireAuth.user),
      switchMap(
        (user): Observable<any> =>
          user
            ? this._angularFireDatabase
                .object(`/adminUsers/${user.uid}`)
                .valueChanges()
                .pipe(take(1))
            : of(undefined)
      ),
      map((adminUser: IAdminUser): any => {
        if (!adminUser) {
          this._router.navigate(['auth/login']);

          this._toasterService.show(EToasterType.DANGER, '', 'auth.authFailed');
        }

        return true;
      })
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return of('guard').pipe(
      switchMap((): Observable<firebase.User> => this._angularFireAuth.user),
      switchMap(
        (user): Observable<any> =>
          user
            ? this._angularFireDatabase
                .object(
                  `/${environment.dbPrefix}/adminUserCredentials/${user.uid}`
                )
                .valueChanges()
                .pipe(take(1))
            : of(undefined)
      ),
      map((adminUser: IAdminUser): any => {
        if (_get(adminUser, 'roles.role') === EAdminRole.INACTIVE) {
          this._angularFireAuth.signOut();
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
}
