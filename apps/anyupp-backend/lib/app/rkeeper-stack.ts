import * as ec2 from '@aws-cdk/aws-ec2';
import * as sst from '@serverless-stack/resources';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { commonLambdaProps } from './lambda-common';
import * as ssm from '@aws-cdk/aws-ssm';
import { getFQParamName } from './utils';
import path from 'path';
import * as ecs from '@aws-cdk/aws-ecs';

export class RKeeperStack extends sst.Stack {
  constructor(scope: sst.App, id: string) {
    super(scope, id);

    const rkeeperLambda = new lambda.Function(this, 'RKeeperWebhookLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/rkeeper-webhook/index.handler',
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/rkeeper-webhook.zip'),
      ),
    });

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

    const asset = new DockerImageAsset(this, 'AnyuppRKeeperBuildImage', {
      directory: path.join(__dirname, 'docker/rkeeper-products'),
    });

    const vpc = new ec2.Vpc(this, 'AnyuppRKeeperVpc', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'AnyuppRKeeperCluster', {
      vpc: vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'AnyuppRKeeperTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
      },
    );

    taskDefinition.addContainer('AnyuppRKeeperContainer', {
      image: ecs.ContainerImage.fromDockerImageAsset(asset),
    });

    new ecs.Ec2Service(this, 'AnyuppRKeeperService', {
      cluster,
      taskDefinition,
    });
  }
}
