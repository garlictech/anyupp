import { Observable, Observer } from 'rxjs';

export const fromApolloSubscription = <T = unknown>(subscription: {
  subscribe: (_arg: Observer<T>) => { unsubscribe: () => void };
}): Observable<T> => {
  return new Observable<T>(observer => {
    const subs = subscription.subscribe({
      next: (x: T) => observer.next(x),
      error: (error: unknown) => observer.error(error),
      complete: () => observer.complete(),
    });

    return () => subs.unsubscribe();
  });
};
