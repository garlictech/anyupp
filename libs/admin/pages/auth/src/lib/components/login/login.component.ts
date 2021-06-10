import {
  appCoreActions,
  appCoreSelectors,
} from 'libs/admin/shared/data-access/app-core/src';
import { take } from 'rxjs/operators';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  public context = '';

  constructor(
    private _store: Store,
    private _cognitoService: CognitoService,
    private _nbToastrService: NbToastrService,
    private _translateService: TranslateService,
  ) {}

  ngAfterViewInit() {
    this._store
      .select(appCoreSelectors.getLoginContextFailure)
      .pipe(take(1))
      .subscribe(loginContextFailure => {
        if (loginContextFailure) {
          this._nbToastrService.danger(
            this._translateService.instant('errors.loginContextFailure'),
            this._translateService.instant('common.error'),
            {
              duration: 4000,
            },
          );

          this._store.dispatch(
            appCoreActions.setLoginContextFailure({
              loginContextFailure: false,
            }),
          );
        }
      });
  }

  public contextChanged(context: string): void {
    this._cognitoService.currentContext = context;
  }
}
