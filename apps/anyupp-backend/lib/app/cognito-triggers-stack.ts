import path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { CustomResource } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';

export class CognitoTriggersStack extends sst.Stack {
  constructor(scope: sst.App, id: string) {
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
      },
    );

    const provider = new Provider(this, 'CognitoTriggerSetupProvider', {
      onEventHandler: triggerSetupLambda,
    });

    new CustomResource(this, 'CognitoTriggers', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::StackSeeder',
      properties: {
        physicalResourceId: scope.logicalPrefixedName('cognitoTriggers'),
      },
    });
  }
}
