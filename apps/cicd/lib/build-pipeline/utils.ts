import {
  aws_iam as iam,
  aws_ssm as ssm,
  aws_codebuild as codebuild,
  aws_chatbot as chatbot,
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipeline_actions,
  aws_codestarnotifications as codestarnotifications,
  aws_s3 as s3,
  RemovalPolicy,
  Duration,
} from 'aws-cdk-lib';
import * as utils from './utils';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sst from '@serverless-stack/resources';

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
    'MailtrapApiKey',
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
          GIT_DISCOVERY_ACROSS_FILESYSTEM: 1,
          AWS_ACCOUNT: stack.account,
          CI: 'ci',
        },
      },
      cache: {
        paths: ['/node_modules/', '/root/.npm/**/*'],
      },
    }),
    cache,
    environment: {
      computeType: codebuild.ComputeType.MEDIUM,
      buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      privileged: true,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notification = new codestarnotifications.CfnNotificationRule(
    stack,
    'BuildNotification',
    {
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
    },
  );
};

export const configurePRNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  stage: string,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notification = new codestarnotifications.CfnNotificationRule(
    stack,
    'BuildNotification',
    {
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
    },
  );
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parameter = new ssm.StringParameter(stack, paramNameParam, {
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
    removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    lifecycleRules: [
      {
        expiration: Duration.days(1),
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
    buildProjectPhases: {
      install: {
        commands: ['apps/cicd/scripts/stage-install.sh'],
      },
      build: {
        commands: [`apps/cicd/scripts/dev-build.sh ${stage} $CI`],
      },
      post_build: {
        commands: [
          `apps/cicd/scripts/dev-post_build.sh ${stage} ${utils.getAppcenterArtifactBucketName(
            stage,
          )} ${adminSiteUrl}`,
        ],
      },
      //reports: {
      //  cypressReports: {
      //    files: ['cyreport/cucumber-json/**/*'],
      //    'file-format': 'CUCUMBERJSON',
      //  },
      //  coverage: {
      //    files: ['coverage/lcov.info'],
      //    'file-format': 'SIMPLECOV',
      //  },
      //},
    },
  });
};
