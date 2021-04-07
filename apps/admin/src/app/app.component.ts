import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import {
  AuthService,
  CognitoService,
} from '@bgap/admin/shared/data-access/auth';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import {
  onAuthUIStateChange,
  CognitoUserInterface,
  AuthState,
} from '@aws-amplify/ui-components';

@Component({
  selector: 'bgap-root',
  template: `
    <amplify-authenticator *ngIf="authState !== 'signedin'" federated="">
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
    <router-outlet *ngIf="authState === 'signedin' && user"></router-outlet>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  user?: CognitoUserInterface;
  authState?: AuthState;
  context = '';

  constructor(
    private _translateService: TranslateService,
    private _authService: AuthService,
    private ref: ChangeDetectorRef,
    private cognitoService: CognitoService,
  ) {
    this._authService.init();

    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang(DEFAULT_LANG);

    // The lang to use, if the lang isn't available, it will use the current loader to get them
    this._translateService.use(DEFAULT_LANG);
  }

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }

  contextChanged(context: string) {
    this.cognitoService.currentContext = context;
  }
}
