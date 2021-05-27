import path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { CustomResource, Duration } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';
import * as appsync from '@aws-cdk/aws-appsync';

export interface CognitoTriggerStackProps extends sst.StackProps {
  appsyncApi: appsync.GraphqlApi;
  pretokenTriggerLambda: lambda.Function;
}

export class CognitoTriggersStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: CognitoTriggerStackProps) {
    super(scope, id);

    const triggerSetupLambda = new lambda.Function(
      this,
      'CognitoTriggerSetupLambda',
      {
        ...commonLambdaProps,
        // It must be relative to the serverless.yml file
        handler: 'lib/lambda/cognito-trigger-setup/index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../.serverless/cognito-trigger-setup.zip'),
        ),
        timeout: Duration.minutes(15),
      },
    );

    triggerSetupLambda.role &&
      triggerSetupLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: [
            'iam:GetPolicy',
            'iam:DeletePolicy',
            'iam:CreatePolicy',
            'iam:AttachRolePolicy',
          ],
          resources: ['*'],
        }),
      );

    const provider = new Provider(this, 'CognitoTriggerSetupProvider', {
      onEventHandler: triggerSetupLambda,
    });

    new CustomResource(this, 'CognitoTriggers', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::StackSeeder',
      properties: {
        physicalResourceId: scope.logicalPrefixedName('cognitoTriggers'),
        appsyncApiArn: props.appsyncApi.arn,
        lambdaRoleName:
          props.pretokenTriggerLambda.role &&
          props.pretokenTriggerLambda.role.roleName,
      },
    });
  }
}
