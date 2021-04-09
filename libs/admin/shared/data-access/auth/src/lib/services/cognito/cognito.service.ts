import { bindNodeCallback, from, Observable, of } from 'rxjs';
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
  // Handle this properly
  private _currentContext = 'DEFAULTCONTEXT';

  // Call this to set the current context to be authorized
  set currentContext(context: string) {
    this._currentContext = context;
  }

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
      this.handleContext();
      this._onSignInCallback?.();
    } else if (
      payload.event === 'signOut' ||
      payload.event === 'oAuthSignOut'
    ) {
      this._onSignOutCallback?.();
    }
  }

  public signIn(): void {
    Auth.federatedSignIn();
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
          user: {
            id: decoded?.sub,
            email: decoded?.email,
          },
        };
      }),
      catchError(() => of(undefined)),
    );
  }

  async handleContext() {
    await from(Auth.currentAuthenticatedUser())
      .pipe(
        switchMap((user: CognitoUser) =>
          from(
            Auth.updateUserAttributes(user, {
              'custom:context': this._currentContext,
            }),
          ).pipe(
            switchMap(() => from(Auth.currentSession())),
            switchMap(session =>
              bindNodeCallback(
                (
                  refreshToken: ReturnType<typeof session.getRefreshToken>,
                  cb: () => void,
                ) => user.refreshSession(refreshToken, cb),
              )(session.getRefreshToken()),
            ),
          ),
        ),
      )
      .toPromise();
  }
}
