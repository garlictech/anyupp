import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as utils from './utils';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sst from '@serverless-stack/resources';
import * as chatbot from '@aws-cdk/aws-chatbot';

export interface PipelineStackProps extends sst.StackProps {
  readonly chatbot: chatbot.SlackChannelConfiguration;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
  readonly appcenterUser: iam.User;
}

export const appConfig = {
  name: 'anyupp-backend',
  appcenterArtifactBucketNamePrefix: 'anyupp-build-artifacts',
};

export const projectPrefix = (stage: string) => `${stage}-${appConfig.name}`;

export const configurePermissions = (
  stack: sst.Stack,
  secretsManager: SecretsManagerStack,
  resources: iam.IGrantable[],
  prefix: string,
) => {
  const generatedParams = [
    'ConsumerWebUserPoolClientId',
    'ConsumerNativeUserPoolClientId',
    'ConsumerUserPoolDomain',
    'IdentityPoolId',
    'AnyuppGraphqlApiKey',
    'AnyuppGraphqlApiUrl',
    'StripeWebhookEndpoint',
    'AdminSiteUrl',
    'AdminWebUserPoolClientId',
    'AdminNativeUserPoolClientId',
    'AdminUserPoolId',
    'AdminUserPoolDomain',
    'CrudApiAppId',
  ].map(paramName => `/${prefix}/generated/${paramName}`);

  const fixParams = [
    'GoogleClientId',
    'StripePublishableKey',
    'FacebookAppId',
    'GoogleApiKey',
  ].map(paramName => `/${prefix}/${paramName}`);

  resources.forEach((resource, index) => {
    secretsManager.pipelineSecrets.grantRead(resource);

    [...generatedParams, ...fixParams].forEach(param =>
      ssm.StringParameter.fromStringParameterName(
        stack,
        param + 'Param' + index,
        param,
      ).grantRead(resource),
    );
  });
};

export const getAppcenterArtifactBucketName = (stage: string) =>
  `${appConfig.appcenterArtifactBucketNamePrefix}-${stage}`;

export const createBuildProject = (
  stack: sst.Stack,
  cache: codebuild.Cache,
  buildProjectPhases: Record<string, unknown>,
  reports?: Record<string, unknown>,
): codebuild.PipelineProject => {
  return new codebuild.PipelineProject(stack, 'Build', {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: buildProjectPhases,
      artifacts: {
        files: ['apps/anyupp-backend/cdk.out/**/*'],
      },
      reports,
      env: {
        'secrets-manager': {
          AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
          AWS_SECRET_ACCESS_KEY: 'codebuild:codebuild-aws_secret_access_key',
          APP_CENTER_TOKEN: 'codebuild:codebuild-appcenter-token',
        },
        variables: {
          NODE_OPTIONS:
            '--unhandled-rejections=strict --max_old_space_size=8196',
        },
      },
    }),
    cache,
    environment: {
      computeType: codebuild.ComputeType.MEDIUM,
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    },
  });
};

export const configurePipeline = (
  stack: sst.Stack,
  stage: string,
): { adminSiteUrl: string } => {
  const adminSiteUrl = ssm.StringParameter.fromStringParameterName(
    stack,
    'AdminSiteUrlParamDev',
    `/${stage}-${appConfig.name}/generated/AdminSiteUrl`,
  ).stringValue;

  return { adminSiteUrl };
};

export const configurePipelineNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  stage: string,
): void => {
  new codestarnotifications.CfnNotificationRule(stack, 'BuildNotification', {
    detailType: 'FULL',
    eventTypeIds: [
      'codepipeline-pipeline-action-execution-failed',
      'codepipeline-pipeline-action-execution-succeeded',
      'codepipeline-pipeline-action-execution-started',
      'codepipeline-pipeline-action-execution-canceled',
    ],
    name: `AnyUppBuildNotification${stage}`,
    resource: resourceArn,
    targets: [
      {
        targetAddress: chatbot.slackChannelConfigurationArn,
        targetType: 'AWSChatbotSlack',
      },
    ],
  });
};

export const configurePRNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  stage: string,
): void => {
  new codestarnotifications.CfnNotificationRule(stack, 'BuildNotification', {
    detailType: 'FULL',
    eventTypeIds: [
      'codebuild-project-build-state-in-progress',
      'codebuild-project-build-state-failed',
      'codebuild-project-build-state-succeeded',
    ],
    name: `AnyUppPRNotification${stage}`,
    resource: resourceArn,
    targets: [
      {
        targetAddress: chatbot.slackChannelConfigurationArn,
        targetType: 'AWSChatbotSlack',
      },
    ],
  });
};

export const copyParameter = (
  paramName: string,
  fromStage: string,
  toStage: string,
  stack: sst.Stack,
) => {
  const paramNameParam = `${toStage}${paramName}Param`;

  const param = ssm.StringParameter.fromStringParameterAttributes(
    stack,
    `${paramNameParam}From`,
    {
      parameterName: `${fromStage}-${appConfig.name}-${paramName}`,
    },
  ).stringValue;

  new ssm.StringParameter(stack, paramNameParam, {
    allowedPattern: '.*',
    description: 'A project parameter',
    parameterName: `${projectPrefix(toStage)}-${paramName}`,
    stringValue: param,
  });
};

export interface BuildPipelineProps extends utils.PipelineStackProps {
  finalizationStage?: codepipeline.StageProps;
  buildProjectPhases: Record<string, unknown>;
  reports?: Record<string, unknown>;
}

export const createPipeline = (
  scope: sst.Stack,
  stage: string,
  props: BuildPipelineProps,
) => {
  const sourceOutput = new codepipeline.Artifact();
  const buildOutput = new codepipeline.Artifact('buildOutput');
  const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);
  const build = utils.createBuildProject(
    scope,
    cache,
    props.buildProjectPhases,
    props.reports,
  );
  const prefix = utils.projectPrefix(stage);

  const buildArtifactBucket = new s3.Bucket(scope, 'ArtifactBucket', {
    bucketName: getAppcenterArtifactBucketName(stage),
    removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    lifecycleRules: [
      {
        expiration: cdk.Duration.days(1),
      },
    ],
  });

  buildArtifactBucket.grantRead(props.appcenterUser);
  utils.configurePermissions(scope, props.secretsManager, [build], prefix);

  const stages: codepipeline.StageProps[] = [
    {
      stageName: 'CloneSource',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'CodeCommit_CloneSource',
          oauthToken: props.secretsManager.githubOauthToken.secretValue,
          output: sourceOutput,
          owner: props.repoOwner,
          repo: props.repoName,
          branch: props.repoBranch,
        }),
      ],
    },
  ];

  if (stage === 'prod') {
    stages.push({
      stageName: 'ApproveProdDeploy',
      actions: [
        new codepipeline_actions.ManualApprovalAction({
          actionName: 'Approve_Prod',
        }),
      ],
    });
  }

  stages.push({
    stageName: 'BuildAndDeploy',
    actions: [
      new codepipeline_actions.CodeBuildAction({
        actionName: 'BuildAndDeploy',
        project: build,
        input: sourceOutput,
        outputs: [buildOutput],
      }),
    ],
  });

  if (props.finalizationStage) {
    stages.push(props.finalizationStage);
  }

  stages.push({
    stageName: 'CLeanup',
    actions: [
      new codepipeline_actions.CloudFormationDeleteStackAction({
        actionName: `DeleteConfigurator`,
        stackName: `${utils.projectPrefix(stage)}-configurator`,
        adminPermissions: true,
      }),
    ],
  });

  const pipeline = new codepipeline.Pipeline(scope, 'Pipeline', {
    stages,
  });

  utils.configurePipelineNotifications(
    scope,
    pipeline.pipelineArn,
    props.chatbot,
    stage,
  );

  buildArtifactBucket.grantWrite(pipeline.role);

  return pipeline;
};

export const createCommonDevPipeline = (
  scope: sst.Stack,
  stage: string,
  props: utils.PipelineStackProps,
) => {
  const { adminSiteUrl } = utils.configurePipeline(scope, stage);

  return createPipeline(scope, stage, {
    ...props,
    finalizationStage: {
      stageName: 'Finalization',
      actions: [
        new codepipeline_actions.CloudFormationDeleteStackAction({
          actionName: `DeleteSeeder`,
          stackName: `${utils.projectPrefix(stage)}-seeder`,
          adminPermissions: true,
        }),
      ],
    },
    buildProjectPhases: {
      install: {
        commands: [
          'chmod +x ./tools/*.sh',
          `./tools/setup-aws-environment.sh`,
          './tools/install-nodejs-14.sh',
          'yarn --frozen-lockfile',
          'npm install -g @aws-amplify/cli appcenter-cli',
        ],
      },
      build: {
        commands: [
          `./tools/build-workspace.sh ${appConfig.name} ${stage}`,
          'git clone https://github.com/flutter/flutter.git -b stable --depth 1 /tmp/flutter',
          `yarn nx deploy crud-backend`,
          `yarn nx deploy anyupp-backend --stage=${stage} --app=${appConfig.name}`,
          'export PATH=$PATH:/tmp/flutter/bin',
          'flutter doctor',
          `yarn nx buildApk anyupp-mobile`,
        ],
      },
      post_build: {
        commands: [
          'tar -cvf ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz apps/anyupp-mobile/lib/awsconfiguration.dart',
          `aws s3 cp \${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz s3://${getAppcenterArtifactBucketName(
            stage,
          )}/`,
          `echo 'Pushing Android APK to appcenter'`,
          `./tools/publish-to-appcenter.sh ${stage} android`,
          `echo 'Triggering ios app build in appcenter...'`,
          `./tools/trigger-appcenter-builds.sh ${stage} ios`,
          `yarn nx test integration-tests-universal --codeCoverage --coverageReporters=clover`,
          `yarn nx test integration-tests-angular --codeCoverage --coverageReporters=clover`,
          `yarn nx e2e-remote admin-e2e --headless --baseUrl=${adminSiteUrl}`,
          'yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-execute.ts',
          'yarn cucumber:report',
          'yarn cypress:generate:html:report',
        ],
      },
    },
    reports: {
      cypressReports: {
        files: ['cyreport/cucumber-json/**/*'],
        'file-format': 'CUCUMBERJSON',
      },
      coverage: {
        files: ['coverage/**/*'],
        'file-format': 'CLOVERXML',
      },
    },
  });
};
