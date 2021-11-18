import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { commonLambdaProps } from './lambda-common';
import * as ssm from '@aws-cdk/aws-ssm';
import { getFQParamName } from './utils';
import path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export interface RKeeperStackProps extends sst.StackProps {
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
}

export class RKeeperStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: RKeeperStackProps) {
    super(scope, id);
    const vpc = new ec2.Vpc(this, 'AnyuppRKeeperVpc', {
      maxAzs: 3,
    });
    //
    // Task Role
    const taskRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'AmazonEC2ContainerRegistryFullAccess',
      ),
    );

    const rkeeperLambda = new lambda.Function(this, 'RKeeperWebhookLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/rkeeper-webhook/index.handler',
      timeout: cdk.Duration.seconds(20),
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/rkeeper-webhook.zip'),
      ),
      environment: {
        RKeeperProcessProductSecurityGroup: vpc.vpcDefaultSecurityGroup,
        RKeeperProcessProductSubnet: vpc.publicSubnets[0].subnetId,
        taskRoleArn: taskRole.roleArn,
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
      },
    });

    if (rkeeperLambda.role) {
      rkeeperLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['ecr:*', 'ecs:*', 'iam:*'],
          resources: ['*'],
        }),
      );
    }

    const api = new apigateway.LambdaRestApi(this, 'RKeeperWebhook', {
      handler: rkeeperLambda,
      deployOptions: {
        stageName: scope.stage,
      },
      proxy: true,
    });

    new ssm.StringParameter(this, 'RKeeperWebhookEndpointParam', {
      allowedPattern: '.*',
      description: 'Webhook for RKeeper',
      parameterName: getFQParamName(scope, 'RKeeperWebhookEndpoint'),
      stringValue: api.url,
    });

    new cdk.CfnOutput(this, 'RKeeperWebhookEndpoint', {
      value: api.url,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductSecurityGroup', {
      value: vpc.vpcDefaultSecurityGroup,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductSubnet', {
      value: vpc.publicSubnets[0].subnetId,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductTaskRoleArn', {
      value: taskRole.roleArn,
    });
  }
}
