import * as R from 'ramda';
import { EMPTY, Observable, Observer } from 'rxjs';
import { expand, map, reduce, takeLast } from 'rxjs/operators';
import { flow } from 'fp-ts/lib/function';

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

export const getAllPaginatedData = <
  INPUT extends Record<string, unknown> & { limit?: number | null },
  OUTPUT,
>(
  op: (
    query: INPUT,
    options?: Record<string, unknown>,
  ) => Observable<
    | { nextToken?: string | null; items?: Array<OUTPUT> | null }
    | null
    | undefined
  >,
  params?: {
    query?: INPUT;
    options?: Record<string, unknown>;
  },
): Observable<{ items: OUTPUT[] }> => {
  const getPage = (nextToken?: string | null) => {
    const fullOp = R.cond([
      [R.isNil, R.always({ limit: 100 } as INPUT)],
      [
        flow(R.prop('item'), R.isNil),
        R.always({ ...params?.query, limit: 100 }),
      ],
      [R.T, R.always(params?.query)],
    ]);

    return op(
      {
        ...fullOp(params?.query),
        nextToken,
      },
      params?.options,
    );
  };

  return getPage().pipe(
    expand(result => (result?.nextToken ? getPage(result.nextToken) : EMPTY)),
    reduce((acc: OUTPUT[], result) => R.concat(acc)(result?.items ?? []), []),
    takeLast(1),
    map(items => ({ items })),
  );
};
