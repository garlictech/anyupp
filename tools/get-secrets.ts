import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import * as fs from 'fs';

const stage = process.argv[2];
const filenamePostfix = stage === 'dev' ? '' : stage + '.';

const secretName = `anyupp-${stage}-secrets`;
const firebaseConfigTargetFile = `${__dirname}/../libs/shared/config/src/lib/config/firebase.config.${filenamePostfix}json`;
const firebaseServiceAccountKeyTargetFile = `${__dirname}/../libs/shared/config/src/lib/config/firebase-service-account-key.${filenamePostfix}json`;

const client = new AWS.SecretsManager({
  region: region,
});

client.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    console.error('Secret error', err);
  } else {
    pipe(
      data.SecretString,
      JSON.parse,
      fp.tap(secret => {
        // Firebase CONFIG
        fs.writeFileSync(
          firebaseConfigTargetFile,
          JSON.stringify(JSON.parse(secret.firebaseConfig), null, 2)
        );
        console.log(`Config written to ${firebaseConfigTargetFile}`);

        // FB service account Key
        fs.writeFileSync(
          firebaseServiceAccountKeyTargetFile,
          JSON.stringify(JSON.parse(secret.firebaseServiceAccountKey), null, 2)
        );
      }),
      fp.tap(() =>
        console.log(`Config written to ${firebaseServiceAccountKeyTargetFile}`)
      )
    );
  }
});
