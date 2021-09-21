import path from 'path';
import { App, Stack } from '@serverless-stack/resources';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import { tableConfig } from '@bgap/crud-gql/backend';

export class AnyuppCrudInfra extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const resolverLambda = new lambda.Function(this, 'CustomResolvers', {
      runtime: lambda.Runtime.NODEJS_14_X,
      functionName: 'anyuppCrudCustomResolvers-' + scope.stage,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/custom-resolvers/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/custom-resolvers.zip'),
      ),
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
