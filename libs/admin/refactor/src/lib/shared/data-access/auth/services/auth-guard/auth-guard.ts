import { defer, iif, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { DataService } from '../../../../../shared/data-access/data';
import * as CrudApi from '@bgap/crud-gql/api';
import { AuthenticatedCognitoUser } from '@bgap/shared/types';

import { CognitoService } from '../cognito/cognito.service';
import { loggedUserSelectors } from '../../../../../store/logged-user';
import { Store } from '@ngrx/store';
import { filterNullish } from '@bgap/shared/utils';
import { appCoreSelectors } from '../../../../../store/app-core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _store: Store,
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

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return iif(
      () => state.url === '/admin/admins',
      defer(() =>
        this._store.select(loggedUserSelectors.getLoggedUser).pipe(
          filterNullish(),
          switchMap(loggedUser =>
            this._store.select(
              appCoreSelectors.getChainRestrictionsByUserId(loggedUser?.id),
            ),
          ),
          map(chainRestrictions => chainRestrictions.length === 0),
        ),
      ),
      defer(() => of(true)),
    );
  }
}
