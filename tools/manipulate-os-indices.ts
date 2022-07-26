// EXECUTE: yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/manipulate-os-indices.ts
import { Client } from '@elastic/elasticsearch';
import { CrudApiConfig } from '../libs/crud-gql/api/src';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

const { createConnector } = require('aws-elasticsearch-js');
const client = new Client({
  nodes: [CrudApiConfig.openSearchEndpoint],
  Connection: createConnector({ region: process.env.AWS_REGION || '' }),
});

console.debug(CrudApiConfig.openSearchEndpoint);

const indices = ['unit'];

from(indices)
  .pipe(
    mergeMap((index: string) =>
      from(
        client.indices.delete({
          index,
        }),
      ).pipe(
        switchMap(() =>
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
          ).pipe(
            catchError(err => {
              console.warn(err);
              return from(
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
              );
            }),
          ),
        ),
      ),
    ),
  )
  .subscribe();
