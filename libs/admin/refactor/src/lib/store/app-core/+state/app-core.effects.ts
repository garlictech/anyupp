import { NGXLogger } from 'ngx-logger';

import { Injectable } from '@angular/core';
import { EToasterType, ToasterService } from '../../../shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { fetch } from '@nrwl/angular';

import { gqlFailure, successAlert } from './app-core.actions';

@Injectable()
export class AppCoreEffects {
  constructor(
    private _actions$: Actions,
    private _logger: NGXLogger,
    private _toasterService: ToasterService,
    private _translateService: TranslateService,
  ) {}

  gqlFailure$ = createEffect(() =>
    this._actions$.pipe(
      ofType(gqlFailure),
      fetch({
        run: action => {
          this._toasterService.show(
            EToasterType.DANGER,
            this._translateService.instant('errors.commonGqlError'),
            this._translateService.instant('common.error'),
            {
              duration: 4000,
            },
          );

          this._logger.error(`[GQL ERROR]: ${action.error.message}`);
        },
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );

  successAlert$ = createEffect(() =>
    this._actions$.pipe(
      ofType(successAlert),
      fetch({
        run: action => {
          this._toasterService.showSimpleSuccess(action.key);
        },
      }),
    ),
  );
}
