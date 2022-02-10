import {
  aws_iam as iam,
  aws_events as events,
  aws_ecs as ecs,
  aws_logs as logs,
  aws_ec2 as ec2,
  aws_ecr_assets as ecr_assets,
  aws_events_targets as eventTargets,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import path from 'path';

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
    const reportAsset = new ecr_assets.DockerImageAsset(
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
        ENVIRONMENT: scope.stage,
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: `report-generator-${scope.stage}`,
        logGroup: new logs.LogGroup(this, 'LogGroup', {
          retention: 7,
        }),
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
