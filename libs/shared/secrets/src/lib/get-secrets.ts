import * as AWS from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { SharedSecrets } from './interfaces';

const region = 'eu-west-1';
// const stage = process.argv[2];
const stage = 'dev'; // TODO: get the actual stage instead of this fix one
const secretName = `anyupp-${stage}-secrets`;

const client = new AWS.SecretsManager({
  region: region,
});

export const getSecrets = (): Promise<SharedSecrets> => {
  return new Promise((resolutionFunc, rejectionFunc) => {
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      if (err) {
        console.error('Secret error', err);
        rejectionFunc(err);
      }
      if (!data.SecretString) {
        rejectionFunc('Missing SecretString');
      } else {
        pipe(
          data.SecretString,
          JSON.parse,
          fp.tap(secret => {
            if (!secret) {
              console.log(`The requested Secret is missing`);
              return rejectionFunc('The requested Secret is missing');
            }
            console.log(
              '### ~ file: get-secrets.ts ~ line 21 ~ data',
              Object.keys(secret),
            );
            resolutionFunc(secret);
          }),
        );
      }
    });
  });
};
