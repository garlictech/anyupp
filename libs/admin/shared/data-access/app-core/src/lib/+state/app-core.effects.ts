import { NGXLogger } from 'ngx-logger';

import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { fetch } from '@nrwl/angular';

import * as AppCoreActions from './app-core.actions';

@Injectable()
export class AppCoreEffects {
  constructor(
    private actions$: Actions,
    private _logger: NGXLogger,
    private _nbToastrService: NbToastrService,
    private _translateService: TranslateService,
  ) {}

  gqlFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppCoreActions.gqlFailure),
      fetch({
        run: action => {
          this._nbToastrService.danger(
            this._translateService.instant('errors.commonGqlError'),
            this._translateService.instant('common.error'),
            {
              duration: 4000,
            },
          );
          this._logger.error(`[GQL ERROR]: ${action.error.message}`);
          // Your custom service 'load' logic goes here. For now just return a success action...
          // return AppCoreActions.loadAppCoreSuccess({ appCore: [] });
        },
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );
}
