import * as fp from 'lodash/fp';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { gqlFailure } from '../+state/app-core.actions';

export const fpMerge = (
  original: Record<string, unknown>,
  values: Record<string, unknown>,
) => fp.merge(original, values);

export const clearDbProperties = <T>(value: T) =>
  fp.omit(['createdAt', 'updatedAt'], <Record<string, unknown>>value);

export const catchGqlError = (store: Store) =>
  catchError((err: Record<string, unknown>) => {
    console.error('ERROR', err);
    store.dispatch(gqlFailure({ error: err }));

    return EMPTY;
  });
