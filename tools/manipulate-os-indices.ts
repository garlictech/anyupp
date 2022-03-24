// EXECUTE: yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/manipulate-os-indices.ts
import { Client } from '@elastic/elasticsearch';
import { CrudApiConfig } from '../libs/crud-gql/api/src';
import { catchError, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';

const { createConnector } = require('aws-elasticsearch-js');
const client = new Client({
  nodes: [CrudApiConfig.openSearchEndpoint],
  Connection: createConnector({ region: process.env.AWS_REGION || '' }),
});

const indices = ['unit'];

from(indices)
  .pipe(
    mergeMap(index =>
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
        catchError(() =>
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
    ),
  )
  .subscribe();

// delete the indices
/*from(indices)
  .pipe(
    mergeMap((index: string) =>
      from(
        client.indices.delete({
          index,
        }),
      ),
    ),
  )
  .subscribe();
  */
