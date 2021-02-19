import { get as _get } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import { EAdminRole, IAdminUser } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _toasterService: ToasterService,
    private _router: Router,
    private _angularFireDatabase: AngularFireDatabase,
    private _angularFireAuth: AngularFireAuth,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return of('guard').pipe(
      switchMap(
        (): Observable<firebase.User | null> => this._angularFireAuth.user,
      ),
      switchMap(
        (user): Observable<IAdminUser | undefined> =>
          user
            ? <Observable<IAdminUser>>(
                this._angularFireDatabase
                  .object(`/adminUsers/${user?.uid || ''}`)
                  .valueChanges()
              )
            : of(undefined),
      ),
      take(1),
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
    return of('guard').pipe(
      switchMap(
        (): Observable<firebase.User | null> => this._angularFireAuth.user,
      ),
      switchMap(
        (user: firebase.User | null): Observable<IAdminUser | undefined> =>
          user !== null
            ? <Observable<IAdminUser>>(
                this._angularFireDatabase
                  .object(`/adminUsers/${user.uid}`)
                  .valueChanges()
              )
            : of(undefined),
      ),
      take(1),
      map((adminUser: IAdminUser | undefined) => {
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
      }),
    );
  }
}
