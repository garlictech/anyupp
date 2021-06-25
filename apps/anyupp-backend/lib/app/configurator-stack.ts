import * as sst from '@serverless-stack/resources';
import { Provider } from '@aws-cdk/custom-resources';
import { CustomResource } from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { commonLambdaProps } from './lambda-common';
import path from 'path';
import { StackProps } from '@serverless-stack/resources';

export interface ConfiguratorStackProps extends StackProps {
  consumerUserPoolId: string;
}

export class ConfiguratorStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: ConfiguratorStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    const updaterLambda = new lambda.Function(this, 'CrudApiUpdaterLambda', {
      ...commonLambdaProps,
      handler: 'lib/lambda/crud-api-updater/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/crud-api-updater.zip'),
      ),
    });

    updaterLambda.role &&
      updaterLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['*'],
          resources: ['*'],
        }),
      );

    const provider = new Provider(this, 'CrudApiUpdaterProvider', {
      onEventHandler: updaterLambda,
    });

    new CustomResource(this, 'CrudApiUpdater', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::CrudApiUpdater',
      properties: {
        userPoolId: props.consumerUserPoolId,
        physicalResourceId: app.logicalPrefixedName('CrudApiUpdater'),
      },
    });
  }
}
