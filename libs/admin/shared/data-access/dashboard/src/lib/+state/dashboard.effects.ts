import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { OrderService } from '@bgap/admin/shared/data-access/order';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fetch } from '@nrwl/angular';

import * as dashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private _store: Store,
    private _orderService: OrderService,
  ) {}

  setHistoryDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardActions.setHistoryDate),
      fetch({
        run: action =>
          dashboardActions.updateSelectedUnitOrderHistory({
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
      ofType(dashboardActions.updateSelectedUnitOrderHistory),
      fetch({
        run: action => {
          this._store
            .select(loggedUserSelectors.getSelectedUnitId)
            .pipe(take(1))
            .subscribe(unitId => {
              if (unitId) {
                this._orderService.listHistoryQuery(unitId, action.historyDate);
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
