import * as fp from 'lodash/fp';
import { EMPTY, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { appCoreActions } from '@bgap/admin/shared/data-access/app-core';
import { Store } from '@ngrx/store';

export const fpMerge = (
  original: Record<string, unknown>,
  values: Record<string, unknown>,
) => fp.merge(original, values);

export const clearDbProperties = <T>(value: T) =>
  fp.omit(['createdAt', 'updatedAt'], <Record<string, unknown>>value);

export const catchGqlError = (store: Store) =>
  catchError((err: Record<string, unknown>) => {
    store.dispatch(appCoreActions.gqlFailure({ error: err }));

    return EMPTY;
  });
