import { Observable, Observer } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SubsType<T> = {
  subscribe: (_arg: Observer<T>) => { unsubscribe: () => void };
};

export const fromApolloSubscription = <T>(
  subscription: SubsType<T>,
): Observable<T> => {
  return new Observable<T>(observer => {
    const subs = subscription.subscribe({
      next: (x: T) => observer.next(x),
      error: (error: unknown) => observer.error(error),
      complete: () => observer.complete(),
    });

    return () => subs.unsubscribe();
  });
};
