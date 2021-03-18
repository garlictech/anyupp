import path from 'path';

import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as amplify from '@aws-cdk/aws-amplify';
import { createStripeResolvers } from '@bgap/stripe';
import * as sst from '@serverless-stack/resources';

import { TableConstruct } from './dynamodb-construct';
import { commonLambdaProps } from './lambda-common';
import { PROJECT_ROOT } from './settings';
import { GraphqlApi } from '@aws-cdk/aws-appsync';
import { Provider, Duration, CustomResource } from '@aws-cdk/core';

export interface SeederStackProps extends sst.StackProps {
  adminAmplifyAppId: string;
}

export class SeederStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: SeederStackProps) {
    super(scope, id);

    const seederLambda = new lambda.Function(this, 'StackSeeder', {
      ...commonLambdaProps,
      handler: 'lib/lambda/stack-seeder/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/stack-seeder.zip'),
      ),
      timeout: Duration.minutes(15),
    });

    const provider = new Provider(this, 'StackSeederProvider', {
      onEventHandler: seederLambda,
    });

    new CustomResource(this, 'StackSeeder', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::StackSeeder',
    });
  }
}
