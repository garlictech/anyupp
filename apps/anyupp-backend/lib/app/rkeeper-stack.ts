import * as ecs from '@aws-cdk/aws-ecs';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { commonLambdaProps } from './lambda-common';
import * as ssm from '@aws-cdk/aws-ssm';
import { getFQParamName } from '@bgap/backend/shared/utils';
import path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';

export interface RKeeperStackProps extends sst.StackProps {
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
  vpc: ec2.IVpc;
  securityGroupId: string;
}

export class RKeeperStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: RKeeperStackProps) {
    super(scope, id);

    const taskRole = new iam.Role(this, 'RkeeperECSTaskExecutionRole', {
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

    const menusyncDockerAsset = new DockerImageAsset(
      this,
      'RKeepermenusyncProcessor',
      {
        directory: path.join(__dirname, '..', '..'),
        file: 'Dockerfile.process-products',
      },
    );

    const menusyncTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      'AnyuppRkeeperMenusyncTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      },
    );

    const dockerImage =
      ecs.ContainerImage.fromDockerImageAsset(menusyncDockerAsset);

    menusyncTaskDefinition.addContainer('DefaultContainer', {
      image: dockerImage,
      environment: {
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'anyupp-process-menusyncs',
        logRetention: 7,
      }),
    });

    const rkeeperLambda = new lambda.Function(this, 'RKeeperWebhookLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/rkeeper-webhook/index.handler',
      timeout: cdk.Duration.seconds(20),
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/rkeeper-webhook.zip'),
      ),
      environment: {
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
      },
      vpc: props.vpc,
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

    new cdk.CfnOutput(this, 'RKeeperTaskRoleArn', {
      value: taskRole.roleArn,
    });

    new cdk.CfnOutput(this, 'RKeeperTaskDefinitionArn', {
      value: menusyncTaskDefinition.taskDefinitionArn,
    });
  }
}
