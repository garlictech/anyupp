import * as sst from '@serverless-stack/resources';
import * as events from '@aws-cdk/aws-events';
import * as logs from '@aws-cdk/aws-logs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as eventTargets from '@aws-cdk/aws-events-targets';
import { anyuppFargateClusterName } from '@bgap/backend/shared/utils';

export interface FargateStackProps extends sst.StackProps {
  reportAccessKeyId: string;
  reportSecretAccessKey: string;
  slackChannel: string;
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
}

export class FargateStack extends sst.Stack {
  constructor(scope: sst.App, id: string, private props: FargateStackProps) {
    super(scope, id);

    //assets
    const reportAsset = new DockerImageAsset(this, 'MyBuildImage', {
      directory: path.join(__dirname, '..', '..'),
      file: 'Dockerfile.generate-report',
    });

    //task roles
    const taskRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );
    //log setting
    const logGroup = new logs.LogGroup(this, 'AnyuppRKeeperLogGroup', {
      logGroupName: '/ecs/products',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //taskdefs
    const reportTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      'AnyuppReportTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      },
    );
    //add container to taskdefs

    reportTaskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromDockerImageAsset(reportAsset),
      environment: {
        AWS_SECRET_ACCESS_KEY: this.props.reportSecretAccessKey,
        AWS_ACCESS_KEY_ID: this.props.reportAccessKeyId,
        CHANNEL: this.props.slackChannel,
        USERPOOL: cdk.Fn.importValue('app.logicalPrefixedName(userPoolId)'),
      },
    });

    //services
    const cluster = ecs.Cluster.fromClusterAttributes(this, 'FargateCluster', {
      clusterName: anyuppFargateClusterName,
      vpc: props.vpc,
      securityGroups: [props.securityGroup],
    });

    const taskDefinition = reportTaskDefinition;
    const role = taskRole;

    new ecs.FargateService(this, 'AnyuppReportService', {
      cluster,
      taskDefinition: reportTaskDefinition,
      serviceName: 'anyupp-report',
    });

    //event rules
    new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '7', weekDay: '1' }),
      targets: [new eventTargets.EcsTask({ cluster, taskDefinition, role })],
    });

    //outputs
    new cdk.CfnOutput(this, 'RKeeperLogGroup', {
      value: logGroup.logGroupName,
      exportName: 'RkeeperLogGroup',
    });
  }
}
