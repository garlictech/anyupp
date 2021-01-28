import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as GroupsFeature from './groups.reducer';
import * as GroupsActions from './groups.actions';

@Injectable()
export class GroupsEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.init),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return GroupsActions.loadGroupsSuccess({ groups: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return GroupsActions.loadGroupsFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
