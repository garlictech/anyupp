import path from 'path';
import { App, Stack } from '@serverless-stack/resources';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import { tableConfig } from '@bgap/crud-gql/backend';
import { secretsManagerArns } from '@bgap/anyupp-backend-lib';
import * as sm from '@aws-cdk/aws-secretsmanager';

export class AnyuppCrudInfra extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const secretsManagerArn =
      secretsManagerArns[scope.stage] || secretsManagerArns.dev;

    const secretsManager = sm.Secret.fromSecretAttributes(
      this,
      'CrudInfraSecrets',
      {
        secretArn: secretsManagerArn,
      },
    );

    const saltSecret = secretsManager.secretValueFromJson('salt').toString();

    const resolverLambda = new lambda.Function(this, 'CustomResolvers', {
      runtime: lambda.Runtime.NODEJS_14_X,
      functionName: `${scope.stage}-anyupp-graphql-resolvers`,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/appsync-lambda/index.handler',
      code: lambda.Code.fromAsset(
        path.join(
          __dirname,
          '../../../../anyupp-backend/.serverless/appsync-lambda.zip',
        ),
      ),
      environment: {
        SALT: saltSecret,
      },
    });

    if (resolverLambda.role) {
      resolverLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
          resources: [tableConfig.Unit.TableArn],
        }),
      );
    }
  }
}

export default function main(app: App): void {
  new AnyuppCrudInfra(app, 'anyupp-crud-infra');
}
