import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import { Store } from '@ngrx/store';
import { getCurrentContextRole, getLoggedUser } from './logged-user.selectors';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { loadLoggedUserSuccess } from './logged-user.actions';
import { EAdminRole } from '@bgap/shared/types';
import { OperatorFunction } from 'rxjs';

@Injectable()
export class LoggedUserEffects {
  watchUserData$ = createEffect(() =>
    this.store.select(getLoggedUser).pipe(
      filter(loggedUser => !!loggedUser?.id),
      map(loggedUser => loggedUser.id as string),
      withLatestFrom(this.store.select(getCurrentContextRole)),
      filter(
        ([_, currentContextRole]) => !!currentContextRole,
      ) as OperatorFunction<
        [string, EAdminRole | undefined],
        [string, EAdminRole]
      >,
      switchMap(([id, currentContextRole]) =>
        this.crudSdk.sdk.OnAdminUserChange({ id }).pipe(
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
