import * as AWS from 'aws-sdk';
const region = 'eu-west-1';
import * as fp from 'lodash/fp';
import { pipe } from 'fp-ts/lib/function';
import * as fs from 'fs';

const client = new AWS.CloudFormation({
  region: region
});

const project = process.argv[2];
const stage = process.argv[3];
const filenamePostfix = stage === 'dev' ? '' : stage + '.';

const targetFile = `${__dirname}/../libs/shared/config/src/lib/config.${filenamePostfix}json`;

client.describeStacks({}, (_, output) =>
  pipe(
    output.Stacks,
    fp.filter(stack => fp.startsWith(`${stage}-${project}`, stack.StackName)),
    fp.map(stack => stack.Outputs),
    fp.flatten,
    fp.map(output => [output.OutputKey, output.OutputValue]),
    fp.uniq,
    fp.fromPairs,
    fp.pick([
      'UserPoolClientId',
      'UserPoolId',
      'IdentityPoolId',
      'GraphQLAPIURL',
      'GraphQLAPIKey',
      'SecretManager',
      'googleClientId',
      'stripePublishableKey'
    ]),
    fp.tap(console.log),
    fp.tap(config =>
      fs.writeFileSync(targetFile, JSON.stringify(config, null, 2))
    ),
    fp.tap(() => console.log(`Config written to ${targetFile}`))
  )
);
