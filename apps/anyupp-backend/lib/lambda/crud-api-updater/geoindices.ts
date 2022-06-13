import { Client } from '@opensearch-project/opensearch';
import { defer, from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/function';
import { CrudApiConfig } from '@bgap/crud-gql/api';

/* eslint-disable @typescript-eslint/no-var-requires */
const { createConnector } = require('@opensearch-project/opensearch');

const client = new Client({
  nodes: [CrudApiConfig.openSearchEndpoint],
  Connection: createConnector({ region: process.env.AWS_REGION || '' }),
});

export const createIndices$ = pipe(
  ['unit'],
  from,
  mergeMap(index =>
    defer(() =>
      from(
        client.indices.create({
          index,
          body: {
            mappings: {
              properties: {
                location: {
                  type: 'geo_point',
                },
              },
            },
          },
        }),
      ),
    ).pipe(
      catchError(() =>
        defer(() =>
          from(
            client.indices.putMapping({
              index,
              body: {
                properties: {
                  location: {
                    type: 'geo_point',
                  },
                },
              },
            }),
          ),
        ),
      ),
      catchError(err => {
        console.warn(
          'The final error during index manipulation (may be OK): ',
          err,
        );
        return of({});
      }),
    ),
  ),
);
