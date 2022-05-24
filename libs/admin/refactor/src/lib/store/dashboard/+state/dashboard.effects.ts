import { switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { loggedUserSelectors } from '../../../store/logged-user';
import { OrderService } from '../../../shared/data-access/order';
import { unitsSelectors } from '../../../store/units';
import { timezoneBudapest } from '@bgap/shared/utils';
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
            .pipe(
              take(1),
              switchMap(unitId =>
                this._store.select(unitsSelectors.getUnitById(unitId || '')),
              ),
            )
            .subscribe(unit => {
              if (unit) {
                this._orderService.listHistoryQuery(
                  unit.id,
                  action.historyDate,
                  unit.timeZone || timezoneBudapest,
                );
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
