import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export const pipeDebug = <T>(tag: string) => {
  return tap<T>({
    next(value) {
      console.log(`[${tag}: Next]`, JSON.stringify(value, undefined, 2));
    },
    error(error) {
      console.log(`[${tag}: Error]`, JSON.stringify(error, undefined, 2));
    },
    complete() {
      console.log(`[${tag}]: Complete`);
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
