import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import * as fs from 'fs';

// Project is unised now, it's anyupp always. Might be changed in the future!
//const project = process.argv[2];
const project = 'anyupp';
const stage = process.argv[3];

const secretName = `${project}-${stage}-secrets`;
const targetDir = `${__dirname}/../libs/shared/config/src/lib/${stage}`;
const firebaseConfigTargetFile = `${targetDir}/firebase.config.json`;
const firebaseServiceAccountKeyTargetFile = `${targetDir}/firebase-service-account-key.json`;

const client = new AWS.SecretsManager({
  region: region,
});

fs.mkdirSync(targetDir, { recursive: true });

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
          JSON.stringify(JSON.parse(secret.firebaseConfig), null, 2),
        );
        console.log(`Config written to ${firebaseConfigTargetFile}`);

        // FB service account Key
        fs.writeFileSync(
          firebaseServiceAccountKeyTargetFile,
          JSON.stringify(JSON.parse(secret.firebaseServiceAccountKey), null, 2),
        );
      }),
      fp.tap(() =>
        console.log(`Config written to ${firebaseServiceAccountKeyTargetFile}`),
      ),
    );
  }
});
