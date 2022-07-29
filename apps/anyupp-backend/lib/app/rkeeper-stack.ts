import {
  aws_events_targets as eventTargets,
  aws_events as events,
  aws_ecr_assets as ecr_assets,
  aws_iam as iam,
  aws_ecs as ecs,
  aws_logs as logs,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_ssm as ssm,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_apigateway as apigateway,
  RemovalPolicy,
  Duration,
  CfnOutput,
  aws_lambda,
} from 'aws-cdk-lib';
import { getFQParamName } from './utils';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { createApiDomainName } from './utils';
import { tableConfig } from '@bgap/crud-gql/backend';
import path from 'path';

export interface RKeeperStackProps extends sst.StackProps {
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
  vpc: ec2.IVpc;
  securityGroupId: string;
  rootDomain: string;
  certificate: acm.ICertificate;
  zone: route53.IHostedZone;
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

    taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem',
          'dynamodb:GetItem',
          'dynamodb:Scan',
          'dynamodb:Query',
          'dynamodb:UpdateItem',
        ],
        resources: [
          tableConfig.ProductCategory.TableArn,
          tableConfig.Unit.TableArn,
          tableConfig.AdminUser.TableArn,
          tableConfig.UnitProduct.TableArn,
          tableConfig.Variant.TableArn,
        ],
      }),
    );

    const menusyncDockerAsset = new ecr_assets.DockerImageAsset(
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

    // The s3 bucket passing the menu json to fargate
    const menuBucket = new s3.Bucket(this, 'AnyuppRkeeperMenuBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: Duration.days(1),
        },
      ],
    });

    menuBucket.grantReadWrite(taskRole);

    const dockerImage =
      ecs.ContainerImage.fromDockerImageAsset(menusyncDockerAsset);

    menusyncTaskDefinition.addContainer('DefaultContainer', {
      image: dockerImage,
      environment: {
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
        BUCKET_NAME: menuBucket.bucketName,
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: `rkeeper-menusync-${scope.stage}`,
        logGroup: new logs.LogGroup(this, 'LogGroup', {
          retention: 7,
        }),
      }),
    });

    const rkeeperLambda = new aws_lambda.Function(
      this,
      'RKeeperWebhookLambda',
      {
        ...commonLambdaProps,
        memorySize: 512,
        timeout: Duration.seconds(20),
        handler: 'index.handler',
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, '../../build/rkeeper-webhook'),
        ),
        environment: {
          API_ACCESS_KEY_ID: props.apiAccessKeyId,
          API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
          RKeeperProcessProductSecurityGroup: props.securityGroupId,
          taskDefinitionArn: menusyncTaskDefinition.taskDefinitionArn,
          RKeeperProcessProductSubnet: props.vpc.privateSubnets[0].subnetId,
          BUCKET_NAME: menuBucket.bucketName,
        },
        vpc: props.vpc,
      },
    );

    if (rkeeperLambda.role) {
      rkeeperLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['ecr:*', 'ecs:*', 'iam:*'],
          resources: ['*'],
        }),
      );

      rkeeperLambda.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy',
        ),
      );

      rkeeperLambda.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonEC2ContainerRegistryFullAccess',
        ),
      );

      menuBucket.grantReadWrite(rkeeperLambda.role);
    }

    const apiName = 'rkeeper-webhook';

    const api = new apigateway.LambdaRestApi(this, 'RKeeperWebhook', {
      handler: rkeeperLambda,
      proxy: true,
      restApiName: apiName,
      deployOptions: {
        stageName: scope.stage,
      },
    });

    createApiDomainName(
      this,
      apiName,
      api,
      props.zone,
      props.rootDomain,
      props.certificate,
    );

    new CfnOutput(this, 'RKeeperTaskRoleArn', {
      value: taskRole.roleArn,
    });

    new CfnOutput(this, 'RKeeperTaskBucketName', {
      value: menuBucket.bucketName,
    });

    new ssm.StringParameter(this, 'RkeeperTaskDefinitionArnParam', {
      allowedPattern: '.*',
      description: 'The current rkeeper task definition for Fargate',
      parameterName: getFQParamName(scope, 'RkeeperTaskDefinitionArn'),
      stringValue: menusyncTaskDefinition.taskDefinitionArn,
    });

    const stuckOrderCleanupLambda = new aws_lambda.Function(
      this,
      'RKeeperStuckOrderCleanupLambda',
      {
        ...commonLambdaProps,
        memorySize: 512,
        timeout: Duration.seconds(30),
        handler: 'index.handler',
        code: aws_lambda.Code.fromAsset(
          path.join(__dirname, '../../build/stuck-order-cleanup'),
        ),
        environment: {
          API_ACCESS_KEY_ID: props.apiAccessKeyId,
          API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
        },
      },
    );

    new events.Rule(this, 'RKeeperStuckOrderCleanupScheduleRule', {
      schedule: events.Schedule.rate(Duration.minutes(10)),
      targets: [new eventTargets.LambdaFunction(stuckOrderCleanupLambda)],
    });
  }
}
