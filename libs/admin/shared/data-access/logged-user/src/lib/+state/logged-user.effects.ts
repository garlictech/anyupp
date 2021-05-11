import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import { Store } from '@ngrx/store';
import {
  fromApolloSubscription,
  OnAdminUserChangeSubscription,
} from '@bgap/crud-gql/api';
import { getCurrentContextRole, getLoggedUser } from './logged-user.selectors';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { loadLoggedUserSuccess } from './logged-user.actions';

@Injectable()
export class LoggedUserEffects {
  watchUserData$ = createEffect(() =>
    this.store.select(getLoggedUser).pipe(
      filter(loggedUser => !!loggedUser?.id),
      map(loggedUser => loggedUser.id as string),
      withLatestFrom(this.store.select(getCurrentContextRole)),
      switchMap(([id, currentContextRole]) =>
        fromApolloSubscription<OnAdminUserChangeSubscription>(
          this.crudSdk.crudSdk.OnAdminUserChange({ id }),
        ).pipe(
          map(loggedUser =>
            loadLoggedUserSuccess({
              loggedUser: {
                ...loggedUser,
                role: currentContextRole,
              },
            }),
          ),
          // TODO @petrot
          //catchError(error => SOME_ERROR_ACTION)
        ),
      ),
    ),
  );

  constructor(private store: Store, private crudSdk: CrudSdkService) {}
}
