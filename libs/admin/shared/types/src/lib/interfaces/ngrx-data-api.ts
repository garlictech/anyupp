import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputMaybe } from '@bgap/crud-gql/api';

export interface ApiListVariables {
  filter?: InputMaybe<any> | undefined;
  limit?: InputMaybe<number> | undefined;
  nextToken?: InputMaybe<string> | undefined;
}

export interface ApiConf<T> {
  list: (
    listVariables: ApiListVariables,
    options: any,
  ) => Observable<
    | {
        items?: Array<T | undefined | null> | undefined | null;
        nextToken?: string | null;
      }
    | undefined
    | null
  >;
  listIds: (
    listVariables: ApiListVariables,
    options: any,
  ) => Observable<
    | {
        items?: Array<{ id: string } | undefined | null> | undefined | null;
        nextToken?: string | null;
      }
    | undefined
    | null
  >;
  get: (
    variables: { id: string },
    options: any,
  ) => Observable<T | undefined | null>;
  add: (input: any) => Observable<T | undefined | null>;
  update: (input: any) => Observable<T | undefined | null>;
}
