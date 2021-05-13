import { DocumentNode } from 'graphql';
import AWSAppSyncClient from 'aws-appsync/lib';
import {
  MutationOptions,
  QueryOptions,
  SubscriptionOptions,
} from 'apollo-client';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fp from 'lodash/fp';

const validDocDefOps = ['mutation', 'query', 'subscription'];

const documentNodeError = new Error(
  'DocumentNode passed to CRUD Client must contain single query or mutation',
);

type ApolloRequesterOptions<V, R> =
  | Omit<QueryOptions<V>, 'variables' | 'query'>
  | Omit<MutationOptions<R, V>, 'variables' | 'mutation'>
  | Omit<SubscriptionOptions<V>, 'variables' | 'subscription'>;

// I don't care about the type parameter of AWSAppSyncClient, just give me
// any appsync client.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSdkRequester = (client: AWSAppSyncClient<any>) => <R, V>(
  doc: DocumentNode,
  variables: V,
  options?: ApolloRequesterOptions<V, R>,
  // When requesting observables in the code generator (to be able to handle
  // the subscriptions), the return value of Requestor is Promise & Observable.
  // Such type cannot exist, so it must be a bug in the generator plugin.
  // However, the generated SDK has the proper types on the individual SDK
  // elemens, so we have to use any to circumvent this internal type problem 🤷
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  // Valid document should contain *single* query or mutation unless it's has
  // a fragment
  if (
    doc.definitions.filter(
      d =>
        d.kind === 'OperationDefinition' &&
        validDocDefOps.includes(d.operation),
    ).length !== 1
  ) {
    throw documentNodeError;
  }

  const definition = doc.definitions[0];

  // Valid document should contain *OperationDefinition*
  if (definition.kind !== 'OperationDefinition') {
    throw documentNodeError;
  }

  // We use any as the doc is just a complicated plain json. Using ?. -s makes the
  // code safe. We throw if fieldname does not exist - it means a deep, unrecoverable
  // problem requiring developer intervention.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldName: string = (doc?.definitions?.[0] as any)?.selectionSet
    ?.selections?.[0]?.name?.value;

  // See comment above. Data arrives from the net, we check the basics
  // then we trust graphql (it delivers the expected response type)
  // Data should be validated in a later release.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processResponse = (response: any) => {
    const data = response?.data;
    // we use fp.has because the we have to handle both the "field does not exist,
    // so undefined" and the "field does exist but its value is undefined or null"
    // cases. The formar case is an unrecoverable server error, the latter
    // case is valid (data does not exist).
    if (!fp.has(fieldName, data)) {
      throw new Error('No data presented in the GraphQL response');
    }

    return data[fieldName];
  };

  switch (definition.operation) {
    case 'mutation': {
      return from(
        client.mutate<R>({
          mutation: doc,
          variables,
        }),
      ).pipe(map(processResponse));
    }
    case 'query': {
      return from(
        client.query<R>({
          query: doc,
          variables,
          ...options,
        }),
      ).pipe(map(processResponse));
    }
    case 'subscription': {
      return client
        .subscribe({
          query: doc,
          variables,
          fetchPolicy: options?.fetchPolicy,
        })
        .map(processResponse);
    }
  }
};

type TypeWithGeneric<T> = Promise<T> | Observable<T>;
type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type decideMonad<T, K> = T extends Promise<any> ? Promise<K> : Observable<K>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReplaceReturnType<T extends (..._a: any) => any, TNewReturn> = (
  ..._a: Parameters<T>
) => NonNullable<TNewReturn>;

type extractMethod<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SDK extends Record<string, any>,
  T extends keyof SDK
> = ReturnType<SDK[T]>;

type extractReturnType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SDK extends Record<string, any>,
  T extends keyof SDK
> = extractGeneric<extractMethod<SDK, T>>;

type StrippedReturnType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SDK extends Record<string, any>,
  T extends keyof SDK
> = extractReturnType<SDK, T>[keyof extractGeneric<extractMethod<SDK, T>>];

export type SdkMethodMapper<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SDK extends Record<string, any>,
  T extends keyof SDK
> = ReplaceReturnType<
  SDK[T],
  decideMonad<ReturnType<SDK[T]>, StrippedReturnType<SDK, T>>
>;
