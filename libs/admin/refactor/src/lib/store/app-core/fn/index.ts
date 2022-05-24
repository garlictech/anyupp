import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { gqlFailure } from '../+state/app-core.actions';

export const catchGqlError = (store: Store) =>
  catchError((err: Record<string, unknown>) => {
    console.error('ERROR', err);
    store.dispatch(gqlFailure({ error: err }));

    return of(err);
  });
