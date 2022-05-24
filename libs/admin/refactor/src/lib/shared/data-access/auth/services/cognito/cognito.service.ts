import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { AuthenticatedCognitoUser } from '@bgap/shared/types';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private _onSignInCallback?: () => void;
  private _onSignOutCallback?: () => void;
  // Handle this properly

  constructor(private _router: Router, private _ngZone: NgZone) {
    Hub.listen('auth', data => {
      const { payload } = data;

      this._onAuthEvent(payload);
    });
  }

  private _onAuthEvent(payload: {
    event: string;
    data?: unknown;
    message?: string;
  }) {
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

  public signIn() {
    Auth.federatedSignIn();
  }

  public signOut(): Observable<boolean> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      switchMap(() => from(Auth.signOut())),
      mapTo(true),
    );
  }

  // Register callback
  public onSignOn(callback: () => void) {
    this._onSignInCallback = callback;
  }

  // Register callback
  public onSignOut(callback: () => void) {
    this._onSignOutCallback = callback;
  }

  public isAuthenticated(): Observable<boolean> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      mapTo(true),
      catchError(() => of(false)),
    );
  }

  public getAuth(): Observable<AuthenticatedCognitoUser | undefined> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      map((auth: CognitoUser) => {
        const token = auth?.getSignInUserSession()?.getIdToken();
        const decoded = token?.decodePayload();

        return {
          user: {
            id: decoded?.['cognito:username'],
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
        tap(() => {
          this._ngZone.run(() => {
            this._router.navigate(['admin/dashboard']);
          });
        }),
      )
      .toPromise();
  }
}
