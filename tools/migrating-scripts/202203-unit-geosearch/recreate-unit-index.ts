// EXECUTE: yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/manipulate-os-indices.ts
import { Client } from '@elastic/elasticsearch';
import { CrudApiConfig } from '../../../libs/crud-gql/api/src';
import { catchError, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import * as CrudApi from '../../../libs/crud-gql/api/src';
import { pipe } from 'fp-ts/lib/function';
const { createConnector } = require('aws-elasticsearch-js');
import * as R from 'ramda';

const client = new Client({
  nodes: [CrudApiConfig.openSearchEndpoint],
  Connection: createConnector({ region: process.env.AWS_REGION || '' }),
});

const awsAccessKeyId =
  process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

const awsSecretAccessKey =
  process.env.API_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';

const crudSdk = CrudApi.getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey);
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
    switchMap(
      (res: any) => from(pipe(res?.items ?? [])),
      R.reject((unit: CrudApi.Unit) => R.isNil(unit?.address.location)),
    ),
    mergeMap(
      (unit: CrudApi.Unit) =>
        crudSdk.UpdateUnit({
          input: {
            id: unit.id,
            location: unit.address.location as CrudApi.LocationInput,
          },
        }),
      10,
    ),
    toArray(),
    tap(res => console.log(`Updated ${res.length} units.`)),
  )
  .subscribe();
