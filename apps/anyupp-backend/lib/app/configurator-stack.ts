import {
  CustomResource,
  aws_iam as iam,
  custom_resources as cr,
  Duration,
  // We must follow this pattern! the aws_iam as iam form was inherited from
  // CDK 1. See #3622
  aws_lambda,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { StackProps } from '@serverless-stack/resources';
import path from 'path';

export interface ConfiguratorStackProps extends StackProps {
  consumerUserPoolId: string;
<<<<<<< HEAD
  appSynclogPublisherRoleArn: string;
=======
  appSynclogPublisherRole: iam.Role;
>>>>>>> chore(infra): add role for appsync and set logging to cloudwatch
}

export class ConfiguratorStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: ConfiguratorStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    const updaterLambda = new aws_lambda.Function(
      this,
      'CrudApiUpdaterLambda',
      {
        ...commonLambdaProps,
        timeout: Duration.seconds(20),
        handler: 'index.handler',
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, '../../build/crud-api-updater'),
        ),
      },
    );

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
        logPublisherArn: props.appSynclogPublisherRoleArn,
      },
    });
  }
}
