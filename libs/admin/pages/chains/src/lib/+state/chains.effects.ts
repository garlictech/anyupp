import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as ChainsFeature from './chains.reducer';
import * as ChainsActions from './chains.actions';

@Injectable()
export class ChainsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainsActions.init),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ChainsActions.loadChainsSuccess({ chains: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ChainsActions.loadChainsFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
