import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

export const buildRetryLogic = <T>({
  // logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryable = (_error: unknown) => true,
  maxRetryAttempts = 3,
  retryScalingDurationInMillisec = 1000,
}: {
  // logger?: { warn: (arg0: string) => void };
  retryable?: (error: unknown) => boolean;
  maxRetryAttempts?: number;
  retryScalingDurationInMillisec?: number;
}) => (source: Observable<T>): Observable<T> =>
  source.pipe(
    retryWhen(
      genericRetryStrategy<T>({
        maxRetryAttempts,
        retryScalingDurationInMillisec,
      }),
    ),
  );

const genericRetryStrategy = <T>({
  maxRetryAttempts = 3,
  retryScalingDurationInMillisec = 1000,
}: // excludedStatusCodes = [],
{
  maxRetryAttempts?: number;
  retryScalingDurationInMillisec?: number;
  // excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<T>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts
        // || excludedStatusCodes.find(e => e === error.status)
      ) {
        return throwError(error);
      }
      console.log(
        `Attempt ${retryAttempt}: retrying in ${
          retryAttempt * retryScalingDurationInMillisec
        }ms`,
      );
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * retryScalingDurationInMillisec);
    }),
    // finalize(() => console.log('We are done!')),
  );
};
