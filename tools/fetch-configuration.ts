import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import * as fp from 'lodash/fp';
import * as fs from 'fs';
import { pipe } from 'fp-ts/lib/function';

const client = new AWS.SSM({
  region: region
});

const project = process.argv[2];
const stage = process.argv[3];
const prefix = `${stage}-${project}-`;
const filenamePostfix = stage === 'dev' ? '' : stage + '.';

const targetFile = `${__dirname}/../libs/shared/config/src/lib/config.${filenamePostfix}json`;

pipe(
  [
    'UserPoolClientId',
    'UserPoolId',
    'IdentityPoolId',
    'GraphqlApiKey',
    'GraphqlApiUrl',
    'googleClientId',
    'stripePublishableKey'
  ],
  fp.map(paramName => `${prefix}${paramName}`),
  paramNames =>
    client.getParameters({ Names: paramNames }, (err, params) => {
      if (err) {
        console.error('Error happened:', JSON.stringify(err, null, 2));
      } else {
        pipe(
          params,
          pars => pars.Parameters || [],
          fp.map(param => [fp.replace(prefix, '', param.Name), param.Value]),
          fp.tap(console.log),
          fp.fromPairs,
          fp.tap(console.log),
          fp.tap(config =>
            fs.writeFileSync(targetFile, JSON.stringify(config, null, 2))
          ),
          fp.tap(() => console.log(`Config written to ${targetFile}`))
        );
      }
    })
);
