import {
  CustomResource,
  aws_iam as iam,
  custom_resources as cr,
  Duration,
  aws_lambda_nodejs,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { StackProps } from '@serverless-stack/resources';

export interface ConfiguratorStackProps extends StackProps {
  consumerUserPoolId: string;
}

export class ConfiguratorStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: ConfiguratorStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    const updaterLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'CrudApiUpdaterLambda',
      {
        ...commonLambdaProps,
        timeout: Duration.seconds(10),
        handler: 'handler',
        entry: __dirname + '/../../lib/lambda/crud-api-updater/index.ts',
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
      },
    });
  }
}
