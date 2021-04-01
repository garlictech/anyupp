import { from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { IAuthenticatedCognitoUser } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private _onSignInCallback?: () => void;
  private _onSignOutCallback?: () => void;

  constructor() {
    Hub.listen('auth', data => {
      const { payload } = data;

      this._onAuthEvent(payload);
    });
  }

  private _onAuthEvent(payload: {
    event: string;
    data?: unknown;
    message?: string;
  }): void {
    if (payload.event === 'signIn') {
      this._onSignInCallback?.();
    } else if (
      payload.event === 'signOut' ||
      payload.event === 'oAuthSignOut'
    ) {
      this._onSignOutCallback?.();
    }
  }

  public signIn(context = 'FOOBARCONTEXT'): void {
    from(Auth.federatedSignIn()).pipe(
      switchMap(() => from(Auth.currentAuthenticatedUser())),
      switchMap(user =>
        from(
          Auth.updateUserAttributes(user, { 'custom:context': context }),
        ).pipe(
          switchMap(() => from(Auth.currentSession())),
          switchMap(session => user.refreshSession(session.getRefreshToken())),
        ),
      ),
    );
  }

  public signOut(): Observable<boolean> {
    return from(Auth.signOut()).pipe(mapTo(true));
  }

  // Register callback
  public onSignOn(callback: () => void): void {
    this._onSignInCallback = callback;
  }

  // Register callback
  public onSignOut(callback: () => void): void {
    this._onSignOutCallback = callback;
  }

  public isAuthenticated(): Observable<boolean> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      mapTo(true),
      catchError(() => of(false)),
    );
  }

  public getAuth(): Observable<IAuthenticatedCognitoUser | undefined> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      map((auth: CognitoUser) => {
        const token = auth?.getSignInUserSession()?.getIdToken();
        const decoded = token?.decodePayload();

        return {
          token: token?.getJwtToken(),
          user: {
            id: decoded?.sub,
            email: decoded?.email,
          },
        };
      }),
      catchError(() => of(undefined)),
    );
  }

  /* Empty ???
  public getUserProfile(): Observable<unknown> {
    return from(Auth.currentUserInfo());
  }
  */

  //
  /*
  public refreshSession(): Observable<boolean> {
    return from(Auth.currentSession()).pipe(mapTo(true));
  }
  */
}
