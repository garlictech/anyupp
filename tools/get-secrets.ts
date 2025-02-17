import { SecretsManager } from 'aws-sdk';
const region = 'eu-west-1';
import { pipe } from 'fp-ts/lib/function';
import { tap, isEmpty } from 'lodash/fp';
import { writeFileSync, mkdirSync } from 'fs';

const project = 'anyupp';
const environment = process.argv[2];
const secretEnvironment = ['dev', 'qa', 'staging', 'prod', 'test'].includes(
  environment,
)
  ? environment
  : 'dev';

const secretName = `${project}-${secretEnvironment}-secrets`;

console.log('Fetching secrets: ', secretName);

const targetDir = `${__dirname}/../libs/shared/config/src/lib/generated`;
const androidKeyStoreTargetFile = `${__dirname}/../apps/anyupp-mobile/android/anyupp-keystore.jks`;
const androidKeyPropertiesTargetFile = `${__dirname}/../apps/anyupp-mobile/android/key.properties`;

const client = new SecretsManager({
  region: region,
});

mkdirSync(targetDir, { recursive: true });

client.getSecretValue({ SecretId: secretName }, (err, data) => {
  if (err) {
    console.error('Secret error', err);
  } else {
    pipe(
      data.SecretString as string,
      tap(secret => {
        if (isEmpty(secret)) {
          throw new Error('Invalid secred');
        }
      }),
      JSON.parse,
      tap(secret => {
        // Android keystore binary
        writeFileSync(androidKeyStoreTargetFile, secret.androidKeyStore, {
          encoding: 'base64',
        });

        // Android keystore binary
        writeFileSync(androidKeyStoreTargetFile, secret.androidKeyStore, {
          encoding: 'base64',
        });
        console.log(`Secret config written to ${androidKeyStoreTargetFile}`);

        // Android key properties (key alias, password, path etc...)
        writeFileSync(
          androidKeyPropertiesTargetFile,
          secret.androidKeyProperties,
          { encoding: 'base64' },
        );
        console.log(
          `Secret config written to ${androidKeyPropertiesTargetFile}`,
        );
      }),
    );
  }
});
