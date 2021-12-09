import { appCoreActions } from '@bgap/admin/shared/data-access/app-core';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import * as UnitsActions from './units.actions';

@Injectable()
export class UnitsEffects {
  constructor(
    private actions$: Actions,
    private _store: Store,
    private _crudSdk: CrudSdkService,
  ) {}

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.createUnit),
      fetch({
        run: action => {
          this._crudSdk.sdk
            .CreateUnit({ input: action.formValue })
            .pipe(
              catchGqlError(this._store),
              tap(() => {
                // Show toaster from effect
                this._store.dispatch(
                  appCoreActions.successAlert({ key: 'insert' }),
                );

                // Close dialog from the AbstractFormDialog
                this._store.dispatch(
                  appCoreActions.setClosableDialog({ closableDialog: true }),
                );
              }),
            )
            .subscribe();
        },
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.updateUnit),
      fetch({
        run: action => {
          this._crudSdk.sdk
            .UpdateUnit({ input: action.formValue })
            .pipe(
              catchGqlError(this._store),
              tap(() => {
                // Show toaster from effect
                this._store.dispatch(
                  appCoreActions.successAlert({ key: 'update' }),
                );

                // Close dialog from the AbstractFormDialog
                this._store.dispatch(
                  appCoreActions.setClosableDialog({ closableDialog: true }),
                );
              }),
            )
            .subscribe();
        },
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );
}
