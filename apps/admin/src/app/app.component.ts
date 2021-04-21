import { DataService } from 'libs/admin/shared/data-access/data/src';
import { EAdminRole } from 'libs/shared/types/src';

import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthState, CognitoUserInterface, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bgap-root',
  template: `
    <amplify-authenticator
      *ngIf="authState !== eAuthState.SignedIn"
      federated=""
    >
      <amplify-sign-in #title header-text="AnyUPP Admin" slot="sign-in">
        <div slot="secondary-footer-content">
          <input
            type="text"
            required
            [ngModel]="context"
            label="Context"
            placeholder="Context"
            (ngModelChange)="contextChanged($event)"
          />
        </div>
        <img
          width="20px"
          slot="header-subtitle"
          src="https://cdn.logo.com/hotlink-ok/logo-social-sq.png"
        />
        <div slot="federated-buttons"></div>
      </amplify-sign-in>
    </amplify-authenticator>
    <router-outlet
      *ngIf="authState === eAuthState.SignedIn && user"
    ></router-outlet>
  `,
})
export class AppComponent {
  public user?: CognitoUserInterface;
  public authState?: AuthState;
  public eAuthState = AuthState;
  public context = '';

  constructor(
    private _translateService: TranslateService,
    private _cognitoService: CognitoService,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang(DEFAULT_LANG);

    // The lang to use, if the lang isn't available, it will use the current loader to get them
    this._translateService.use(DEFAULT_LANG);

    onAuthUIStateChange((authState: AuthState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;

      if (authState === AuthState.SignedIn && this.user) {
        const token = this.user.getSignInUserSession()?.getIdToken();
        const decoded = token?.decodePayload();

        this._changeDetectorRef.detectChanges();

        this._dataService.initDataConnections(this.user.attributes.sub || '', decoded.role || EAdminRole.INACTIVE);
      } else {
        this._dataService.destroyDataConnection();
      }
    });

    this._cognitoService.onSignOut(() => {
      this._dataService.destroyDataConnection();
    });
  }

  public contextChanged(context: string): void {
    this._cognitoService.currentContext = context;
  }
}
