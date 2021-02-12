import * as AWS from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';

const region = 'eu-west-1';
// const stage = process.argv[2];
const stage = 'dev'; // TODO: get the actual stage instead of this fix one
const secretName = `anyupp-${stage}-secrets`;

const client = new AWS.SecretsManager({
  region: region,
});

export const getSecret = (key?: string) => {
  client.getSecretValue;
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
            const requestedSecret = key ? secret[key] : secret;

            if (!requestedSecret) {
              console.log(`The requested Config is missing`);
              return rejectionFunc('The requested Config is missing');
            }

            resolutionFunc(requestedSecret);
          })
        );
      }
    });
  });
};
