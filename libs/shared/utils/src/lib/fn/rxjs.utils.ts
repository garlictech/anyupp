import {
  Observable,
  of,
  OperatorFunction,
  pipe,
  throwError,
  UnaryFunction,
} from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
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
    filter(x => x != null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >,
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
