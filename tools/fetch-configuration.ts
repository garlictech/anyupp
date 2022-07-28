import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import * as fp from 'lodash/fp';
import * as fs from 'fs';
import { flow, pipe } from 'fp-ts/lib/function';
import { map } from 'rxjs/operators';
import { GetParametersRequest, GetParametersResult } from 'aws-sdk/clients/ssm';
import { bindNodeCallback, Observable, combineLatest } from 'rxjs';

const client = new AWS.SSM({ region });

const environment = process.argv[2];
const prefix = `${environment}-anyupp-backend`;

const targetDir = `${__dirname}/../libs/shared/config/src/lib/generated`;
const targetFile = `${targetDir}/config.json`;
const mobileAppConfigurationFile = `${__dirname}/../apps/anyupp-mobile/lib/awsconfiguration.dart`;

const amplifyMetaConfigFile = `${__dirname}/../apps/crud-backend/amplify/backend/amplify-meta.json`;

//--- Read generated crud amplify backend (meta-) config
const amplifyConfig = JSON.parse(
  fs.readFileSync(amplifyMetaConfigFile, 'utf8'),
);

fs.mkdirSync(targetDir, { recursive: true });

const generatedParams = [
  'IdentityPoolId',
  'ConsumerWebUserPoolClientId',
  'ConsumerUserPoolDomain',
  'ConsumerUserPoolId',
  'AdminUserPoolId',
  'AdminWebUserPoolClientId',
  'RkeeperWebhookEndpoint',
  'RkeeperWebhookEndpoint',
  'RkeeperTaskDefinitionArn',
].map(paramName => `/${prefix}/generated/${paramName}`);

const fixParams = [
  'StripePublishableKey',
  'StripePublishableKeyNewApi',
  'GoogleApiKey',
  'MailtrapApiKey',
].map(paramName => `/${prefix}/${paramName}`);

pipe(
  [...generatedParams, ...fixParams],
  // We need to do this because the stuff can query max 10 parameters in one request
  fp.chunk(10),
  fp.map(
    flow(
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
          fp.map(param => [
            pipe(param.Name, fp.split('/'), fp.last),
            param.Value,
          ]),
        ),
      ),
      fp.flatten,
      fp.fromPairs,
      fp.tap(config => {
        console.log(config);
        config['Region'] = region;
        fs.writeFileSync(targetFile, JSON.stringify(config, null, 2));
        console.log(`Config written to ${targetFile}`);
      }),
      fp.tap(config => {
        const apiKeyName = Object.keys(amplifyConfig['api'])[0];
        if (!amplifyConfig['storage']) {
          throw Error(
            'No bucket configured for this Amplify environment! amplify-meta.json must have a "bucket": section.',
          );
        }
        const bucketKeyName = Object.keys(amplifyConfig['storage'])[0];
        config['Region'] = region;
        config['Stage'] = environment;
        config['CrudGraphqlApiUrl'] =
          amplifyConfig['api'][apiKeyName]['output'][
            'GraphQLAPIEndpointOutput'
          ];
        config['CrudGraphqlApiKey'] =
          amplifyConfig['api'][apiKeyName]['output']['GraphQLAPIKeyOutput'];
        config['S3BucketName'] =
          amplifyConfig['storage'][bucketKeyName]['output']['BucketName'];
        console.log(config);

        fs.writeFileSync(
          mobileAppConfigurationFile,
          `const AWSCONFIG = '''${JSON.stringify(config, null, 2)}''';`,
        );
        console.log(
          `Mobile application config written to ${mobileAppConfigurationFile}`,
        );
      }),
    ),
  ),
).subscribe();
