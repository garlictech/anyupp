import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';

import * as DashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private _store: Store,
    private _dataService: DataService,
  ) {}

  setHistoryDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.setHistoryDate),
      fetch({
        run: action =>
          DashboardActions.updateSelectedUnitOrderHistory({
            historyDate: action.historyDate,
          }),
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );

  updateSelectedUnitOrderHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.updateSelectedUnitOrderHistory),
      fetch({
        run: action => {
          this._store
            .select(loggedUserSelectors.getSelectedUnitId)
            .pipe(take(1))
            .subscribe(unitId => {
              if (unitId) {
                this._dataService.listHistoryQuery(unitId, action.historyDate);
              }
            });
        },
        onError: (/*action, error*/) => {
          // return AppCoreActions.loadAppCoreFailure({ error });
        },
      }),
    ),
  );
}
