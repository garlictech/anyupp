import { interval, Observable, of, throwError } from 'rxjs';
import { delayWhen, retryWhen, switchMap, take, tap } from 'rxjs/operators';

export const buildRetryLogic = <T>({
  logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryable = (_error: unknown) => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryDelayInMillisec = (_error: unknown) => 1000,
}: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logger?: { warn: (arg0: string) => void };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryable?: (error: unknown) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryDelayInMillisec?: (error: unknown) => number;
}) => (source: Observable<T>): Observable<T> =>
  source.pipe(
    retryWhen(errors =>
      errors.pipe(
        tap(error =>
          logger?.warn(`Error happened... ${JSON.stringify(error, null, 2)}`),
        ),
        switchMap(error =>
          retryable(error)
            ? of(retryDelayInMillisec(error)).pipe(
                tap(delayValue => logger?.warn(`Retry in ${delayValue} ms...`)),
                delayWhen(delayValue => interval(delayValue).pipe(take(1))),
              )
            : throwError(error),
        ),
        take(3),
      ),
    ),
  );
