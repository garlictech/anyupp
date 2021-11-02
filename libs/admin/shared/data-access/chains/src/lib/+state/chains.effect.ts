import { cloneDeep } from 'lodash/fp';
import { switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  appCoreActions,
  catchGqlError,
} from '@bgap/admin/shared/data-access/app-core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ToasterService } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish } from '@bgap/shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';

import * as ChainsActions from './chains.actions';

@Injectable()
export class ChainsEffects {
  constructor(
    private actions$: Actions,
    private _store: Store,
    private _crudSdk: CrudSdkService,
    private _toasterService: ToasterService,
  ) {}

  createChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainsActions.createChain),
      fetch({
        run: action => {
          this._crudSdk.sdk
            .CreateChain({ input: action.formValue })
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

  updateChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainsActions.updateChain),
      fetch({
        run: action => {
          this._crudSdk.sdk
            .UpdateChain({ input: action.formValue })
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

  updateChainImageStyles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainsActions.updateChainImageStyles),
      fetch({
        run: action => {
          this._crudSdk.sdk
            .GetChain({
              id: action.chainId,
            })
            .pipe(
              filterNullish(),
              switchMap(data => {
                const _data: CrudApi.Chain = cloneDeep(data);
                const chainStyleImagesRecord: Record<
                  string,
                  keyof CrudApi.ChainStyleImages
                > = {
                  header: 'header',
                  logo: 'logo',
                };

                if (!_data.style.images) {
                  _data.style.images = {};
                }

                if (chainStyleImagesRecord[action.param]) {
                  _data.style.images[chainStyleImagesRecord[action.param]] =
                    action.image;
                }

                return this._crudSdk.sdk.UpdateChain({
                  input: {
                    id: _data.id,
                    style: _data.style,
                  },
                });
              }),
              catchGqlError(this._store),
              tap(() => {
                this._toasterService.showSimpleSuccess(
                  action.image
                    ? 'common.imageUploadSuccess'
                    : 'common.imageRemoveSuccess',
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
