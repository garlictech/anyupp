import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import { IAdminUser } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _angularFireDatabase: AngularFireDatabase,
    private _router: Router,
    private _dataService: DataService,
    private _toasterService: ToasterService,
  ) {
    this._angularFireAuth.authState.subscribe(
      (user: firebase.User | null): void => {
        if (user) {
          this._angularFireDatabase
            .object(`adminUsers/${user.uid}`)
            .valueChanges()
            .pipe(take(1))
            .subscribe(
              (adminUser: IAdminUser | unknown): void => {
                if (adminUser) {
                  this._dataService.initDataConnections(user.uid);
                } else {
                  this._dataService.destroyDataConnection();
                  localStorage.removeItem('user');
                }
              },
              (err): void => {
                console.error('authstate err', err);
              },
            );
        } else {
          this._dataService.destroyDataConnection();
          localStorage.removeItem('user');
        }
      },
    );
  }

  public async signIn(email: string, password: string): Promise<void> {
    try {
      this._angularFireAuth.signInWithEmailAndPassword(email, password).then(
        (credential): void => {
          localStorage.setItem('user', JSON.stringify(credential.user));

          // this._user = credential.user;
          this._router.navigate(['admin/dashboard']);
        },
        (err): void => {
          console.error('err', err);
          this._toasterService.show(EToasterType.DANGER, '', 'auth.authFailed');
        },
      );
    } catch (err) {
      console.error('TODO ERROR HANDLING', err);
    }
  }

  public async signOut(): Promise<void> {
    try {
      await this._angularFireAuth.signOut();

      this._dataService.destroyDataConnection();
      localStorage.removeItem('user');

      this._router.navigate(['auth/login']);
    } catch (err) {
      console.error('TODO ERROR HANDLING', err);
    }
  }

  public createUserWithEmailAndRandomPassword(
    email: string,
  ): Promise<firebase.auth.UserCredential> {
    const password = Math.random().toString(36).substring(2, 10);

    return this._angularFireAuth.createUserWithEmailAndPassword(
      email,
      password,
    );
  }

  public sendPasswordResetEmail(email: string): Promise<void> {
    return this._angularFireAuth.sendPasswordResetEmail(email);
  }
}
