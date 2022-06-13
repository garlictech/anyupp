// EXECUTE: yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/manipulate-os-indices.ts
import { Client } from '@elastic/elasticsearch';
import {
  CrudApiConfig,
  getCrudSdkForIAM,
} from '../../../libs/crud-gql/api/src';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { from } from 'rxjs';

import { pipe } from 'fp-ts/lib/function';
const { createConnector } = require('aws-elasticsearch-js');
import * as R from 'ramda';
import { Unit } from '../../../libs/domain/src';

const client = new Client({
  nodes: [CrudApiConfig.openSearchEndpoint],
  Connection: createConnector({ region: process.env.AWS_REGION || '' }),
});

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);
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
    toArray(),
    switchMap(() => crudSdk.ListUnits()),
    map(x => x as { items: Unit[] }),
    switchMap((res: { items: Unit[] }) =>
      from(
        pipe(
          res?.items ?? [],
          R.reject((unit: Unit) => R.isNil(unit?.address.location)),
        ),
      ),
    ),
    mergeMap(
      (unit: Unit) =>
        crudSdk.UpdateUnit({
          input: {
            id: unit.id,
            location: {
              lat: unit.address.location.lat,
              lon: unit.address.location.lng,
            },
          },
        }),
      10,
    ),
    toArray(),
    tap(res => console.log(`Updated ${res.length} units.`)),
  )
  .subscribe();
