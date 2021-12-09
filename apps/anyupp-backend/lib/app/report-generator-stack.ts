import * as sst from '@serverless-stack/resources';
import * as events from '@aws-cdk/aws-events';
import * as ecs from '@aws-cdk/aws-ecs';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as eventTargets from '@aws-cdk/aws-events-targets';

export interface ReportGeneratorStackProps extends sst.StackProps {
  reportAccessKeyId: string;
  reportSecretAccessKey: string;
  slackChannel: string;
  vpc: ec2.IVpc;
  userPoolId: string;
  slackBotToken: string;
  cluster: ecs.ICluster;
}

export class ReportGeneratorStack extends sst.Stack {
  constructor(
    scope: sst.App,
    id: string,
    private props: ReportGeneratorStackProps,
  ) {
    super(scope, id);

    const taskRole = new iam.Role(this, 'ReportGeneratorECSTaskExecutionRole', {
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

    //assets
    const reportAsset = new DockerImageAsset(
      this,
      'ReportGeneratorBuildImage',
      {
        directory: path.join(__dirname, '..', '..'),
        file: 'Dockerfile.generate-report',
      },
    );

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
    const dockerImage = ecs.ContainerImage.fromDockerImageAsset(reportAsset);

    reportTaskDefinition.addContainer('DefaultContainer', {
      image: dockerImage,
      environment: {
        AWS_SECRET_ACCESS_KEY: this.props.reportSecretAccessKey,
        AWS_ACCESS_KEY_ID: this.props.reportAccessKeyId,
        SLACK_CHANNEL: this.props.slackChannel,
        USER_POOL_ID: props.userPoolId,
        SLACK_BOT_TOKEN: props.slackBotToken,
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'anyupp-process-products',
        logRetention: 7,
      }),
    });

    //
    //event rules
    new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.cron({ minute: '0', hour: '7' }),
      targets: [
        new eventTargets.EcsTask({
          cluster: props.cluster,
          taskDefinition: reportTaskDefinition,
        }),
      ],
    });
  }
}
