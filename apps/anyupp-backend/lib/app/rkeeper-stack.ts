import * as logs from '@aws-cdk/aws-logs';
import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { commonLambdaProps } from './lambda-common';
import * as ssm from '@aws-cdk/aws-ssm';
import { getFQParamName } from './utils';
import path from 'path';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export interface RKeeperStackProps extends sst.StackProps {
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
}

export class RKeeperStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: RKeeperStackProps) {
    super(scope, id);

    const asset = new DockerImageAsset(this, 'AnyuppRKeeperBuildImage', {
      directory: path.join(__dirname, '..', '..'),
      file: 'Dockerfile.process-products',
    });

    const vpc = new ec2.Vpc(this, 'AnyuppRKeeperVpc', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'AnyuppRKeeperCluster', {
      vpc: vpc,
    });

    // Task Role
    const taskRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'AnyuppRKeeperTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      },
    );

    const logGroup = new logs.LogGroup(this, 'AnyuppRKeeperLogGroup', {
      logGroupName: '/ecs/AnyuppRKeeperProducts',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const logDriver = new ecs.AwsLogDriver({
      logGroup,
      streamPrefix: 'AnyuppRKeeperProducts',
    });

    const containerName = 'anyupp-rkeeper-process-products';

    taskDefinition.addContainer('AnyuppRKeeperContainer', {
      image: ecs.ContainerImage.fromDockerImageAsset(asset),
      logging: logDriver,
      containerName,
    });

    new ecs.FargateService(this, 'AnyuppRKeeperService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      serviceName: 'anyupp-rkeeper-process-products',
    });

    const rkeeperLambda = new lambda.Function(this, 'RKeeperWebhookLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/rkeeper-webhook/index.handler',
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/rkeeper-webhook.zip'),
      ),
      environment: {
        RKeeperProcessProductTaskArn: taskDefinition.taskDefinitionArn,
        RKeeperProcessProductSecurityGroup: vpc.vpcDefaultSecurityGroup,
        RKeeperProcessProductSubnet: vpc.publicSubnets[0].subnetId,
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

    new cdk.CfnOutput(this, 'RKeeperProcessProductTaskArn', {
      value: taskDefinition.taskDefinitionArn,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductSecurityGroup', {
      value: vpc.vpcDefaultSecurityGroup,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductSubnet', {
      value: vpc.publicSubnets[0].subnetId,
    });

    new cdk.CfnOutput(this, 'RKeeperProcessProductContainerName', {
      value: containerName,
    });
  }
}
