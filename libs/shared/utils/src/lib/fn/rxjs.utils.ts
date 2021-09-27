import {
  Observable,
  of,
  OperatorFunction,
  pipe,
  throwError,
  UnaryFunction,
} from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap, tap } from 'rxjs/operators';
import * as fp from 'lodash/fp';

export const pipeDebug = <T>(tag: string) => {
  return tap<T>({
    next(value) {
      console.debug(`[${tag}: Next]`, JSON.stringify(value, undefined, 2));
    },
    error(error) {
      console.debug(`[${tag}: Error]`, JSON.stringify(error, undefined, 2));
    },
    complete() {
      console.debug(`[${tag}]: Complete`);
    },
  });
};

export function filterNullish<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter(x => x !== null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >,
  );
}

export function filterNullishWithDefault<T>(
  defaultValue: T,
): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  return pipe(
    filter(x => x !== null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >,
    defaultIfEmpty(defaultValue),
  );
}

export function filterNullishElements<T>(): UnaryFunction<
  Observable<Array<T | null | undefined> | null | undefined>,
  Observable<T[]>
> {
  return pipe(
    filterNullish(),
    map(fp.filter(fp.negate(fp.isEmpty))) as OperatorFunction<
      Array<T | null | undefined>,
      T[]
    >,
  );
}

export function filterNullishGraphqlListWithDefault<T>(
  defaultValue: T[],
): UnaryFunction<
  Observable<
    | {
        items?: Array<T | null | undefined> | null;
        nextToken?: string | null;
      }
    | null
    | undefined
  >,
  Observable<T[]>
> {
  return pipe(
    filterNullishWithDefault<{
      items?: Array<T | null | undefined> | null;
    }>({
      items: defaultValue,
    }),
    map(listResult => listResult.items),
    filterNullishWithDefault<Array<T | null | undefined>>(defaultValue),
    filterNullishElements<T>(),
  );
}

export function throwIfEmptyValue<T>(
  message = 'Unexpected empty value',
): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  return pipe(
    switchMap(x =>
      fp.isEmpty(x) ? throwError(new Error(message)) : of(x),
    ) as OperatorFunction<T | null | undefined, T>,
  );
}
