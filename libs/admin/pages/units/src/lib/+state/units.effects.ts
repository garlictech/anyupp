import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as UnitsFeature from './units.reducer';
import * as UnitsActions from './units.actions';

@Injectable()
export class UnitsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitsActions.init),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return UnitsActions.loadUnitsSuccess({ units: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return UnitsActions.loadUnitsFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
