import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import * as fp from 'lodash/fp';
import * as fs from 'fs';
import { flow, pipe } from 'fp-ts/lib/function';
import { map } from 'rxjs/operators';
import {
  GetParameterRequest,
  GetParametersRequest,
  GetParametersResult,
} from 'aws-sdk/clients/ssm';
import { bindNodeCallback, Observable, combineLatest } from 'rxjs';

const client = new AWS.SSM({ region });

const project = process.argv[2];
const stage = process.argv[3];
const prefix = `${stage}-${project}-`;

const targetDir = `${__dirname}/../libs/shared/config/src/lib/${stage}`;
const targetFile = `${targetDir}/config.json`;

fs.mkdirSync(targetDir, { recursive: true });

pipe(
  // We need to do this because the stuff can query max 10 parameters in one request
  [
    [
      'AdminSiteUrl',
      'consumerUserPoolClientId',
      'consumerUserPoolId',
      'consumerUserPoolDomain',
      'IdentityPoolId',
      'GraphqlApiKey',
      'GraphqlApiUrl',
      'StripeWebhookEndpoint',
      'googleClientId',
      'stripePublishableKey',
    ],
    ['adminUserPoolClientId', 'adminUserPoolId', 'adminUserPoolDomain'],
  ],
  fp.map(
    flow(
      fp.map(paramName => `${prefix}${paramName}`),
      paramNames =>
        bindNodeCallback((params: GetParametersRequest, callback: any) =>
          client.getParameters(params, callback),
        )({ Names: paramNames }) as Observable<GetParametersResult>,
    ),
  ),
  x => combineLatest(x),
  map(
    flow(
      fp.map(
        flow(
          pars => pars.Parameters || [],
          fp.map(param => [fp.replace(prefix, '', param.Name), param.Value]),
        ),
      ),
      fp.flatten,
      fp.fromPairs,
      fp.tap(config => {
        console.log(config);
        fs.writeFileSync(targetFile, JSON.stringify(config, null, 2));
        console.log(`Config written to ${targetFile}`);
      }),
    ),
  ),
).subscribe();
