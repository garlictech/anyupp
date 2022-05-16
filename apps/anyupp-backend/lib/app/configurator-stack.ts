import {
  CustomResource,
  aws_lambda as lambda,
  aws_iam as iam,
  custom_resources as cr,
  Duration,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
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
      timeout: Duration.seconds(10),
      handler: 'lib/lambda/crud-api-updater/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless-2/crud-api-updater.zip'),
      ),
    });

    if (updaterLambda.role) {
      updaterLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['*'],
          resources: ['*'],
        }),
      );
    }

    const provider = new cr.Provider(this, 'CrudApiUpdaterProvider', {
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
