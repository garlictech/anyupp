import path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { Duration, CustomResource } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';
import * as cognito from '@aws-cdk/aws-cognito';

export interface SeederStackProps extends sst.StackProps {
  adminUserPool: cognito.UserPool;
  consumerUserPool: cognito.UserPool;
  anyuppApiArn: string;
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
}

export class SeederStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: SeederStackProps) {
    super(scope, id);
    const AdminUserPoolId = props.adminUserPool.userPoolId;
    const ConsumerUserPoolId = props.consumerUserPool.userPoolId;

    const seederLambda = new lambda.Function(this, 'StackSeederLambda', {
      ...commonLambdaProps,
      handler: 'lib/lambda/stack-seeder/index.handler',
      memorySize: 512,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless-1/stack-seeder.zip'),
      ),
      timeout: Duration.minutes(15),
      environment: {
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
      },
      initialPolicy: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['*'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['appsync:GraphQL'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:AdminSetUserPassword',
            'cognito-idp:AdminGetUser',
            'cognito-idp:AdminCreateUser',
          ],
          resources: [props.adminUserPool.userPoolArn],
        }),
      ],
    });

    seederLambda.role &&
      seederLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['appsync:GraphQL'],
          resources: ['*'],
        }),
      );

    const provider = new Provider(this, 'StackSeederProvider', {
      onEventHandler: seederLambda,
    });

    new CustomResource(this, 'StackSeeder', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::StackSeeder',
      properties: {
        AdminUserPoolId,
        ConsumerUserPoolId,
        physicalResourceId: scope.logicalPrefixedName('seeder'),
      },
    });
  }
}
